import { FieldPacket, RowDataPacket } from 'mysql2';
import { DotProduct, HadamardProduct } from '../utils/linearalgebra';
import { SimpleDBTransactionWrapper, SimpleWrapperConn } from '../db';
import { SearchResult } from '../../../shared/Models/SearchResult';
import { GetTripActivities } from './activityWrapper';
import { Trip } from '../../../shared/Models/Trip';
import { SphericalCosine } from '../utils/geo';
import { Experience, StrToExperience } from '../../../shared/Models/Activity';
import { AssertUnreachable } from '../../../shared/Utils/TypescriptHelpers';
import { DaysBetweenDates } from '../../../shared/Utils/Date';
import { WrapInfTo0 } from '../utils/general';
import { rad2deg, deg2rad, EarthRadius as R } from '../utils/constants';

/**
 * Maps Experience enum to numerical constant
 * @param e Experience num value
 * @returns numerical constant related to enum
 */
function ExperienceToNum(e: Experience): number {
  switch (e) {
    case Experience.beginner:
      return -0.5;
    case Experience.intermediate:
      return 0;
    case Experience.expert:
      return 0.5;
    default:
      return AssertUnreachable(e);
  }
}

/**
 * Calculate a numerical similarity between two Experience enums
 * @param e1 Experience 1
 * @param e2 Experience 2
 * @returns Numerical similarity between 0 and 1
 */
function ExperienceSimilarity(e1: Experience, e2: Experience) {
  const e1Num = ExperienceToNum(e1);
  const e2Num = ExperienceToNum(e2);

  return 1 - Math.abs(e1Num - e2Num);
}

/**
 * Fetch search result from db for trip id
 * @param trip_id Trip id to fetch search result for
 * @param distance Distance between search result and original search trip
 * @param conn db connection
 * @returns search result for specified trip
 */
async function FetchSearchResult(trip_id: number, distance: number, conn: SimpleWrapperConn): Promise<SearchResult> {
  const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.execute(`SELECT BIN_TO_UUID(trip.uuid, true) as trip_uuid, user.name, user.bio_description, user.avatar, trip.start_date, trip.end_date
                                FROM
                                    trip
                                JOIN user ON trip.user_id = user.id
                                WHERE
                                    trip.id = ?`, [trip_id]);

  // Fetch trip activites
  const activites = await GetTripActivities(trip_id, conn);

  // Cast db row to Trip and add activites
  return new SearchResult({ ...rows[0] as SearchResult, activites, distance: Math.round(distance) });
}

export async function SearchIndividualTrips(user_id: number, trip_uuid: string, parentConn?: SimpleWrapperConn): Promise<SearchResult[]> {
  return SimpleDBTransactionWrapper<SearchResult[]>(async (conn) => {
    const maxDistance = 20; // 50 km max distance

    // Fetch search trip from db
    const [searchTripRows]: [RowDataPacket[], FieldPacket[]] = await conn.execute('SELECT id AS trip_id, BIN_TO_UUID(uuid, true) AS uuid, name, start_date, end_date, lat, lng, text_loc, user_id FROM trip WHERE user_id = ? AND uuid = UUID_TO_BIN(?, true)', [user_id, trip_uuid]);

    // Fetch trip activites
    const activites = await GetTripActivities(searchTripRows[0].trip_id, conn);

    const searchTripId = searchTripRows[0].trip_id;
    const searchTrip = new Trip({ ...searchTripRows[0] as Trip, activites });
    if (!searchTrip) { throw new Error('Invalid trip inputed'); }

    // Query db for activity column headings
    // Based off https://stackoverflow.com/questions/12598120/mysql-pivot-table-query-with-dynamic-columns

    await conn.query('SET @sql = ""');
    await conn.execute("SELECT @sql := CONCAT(@sql,if(@sql='','',', '),temp.output), @sql FROM ( SELECT DISTINCT CONCAT('MAX(IF(activity.name = ''', name, ''', activitytotrip.experience, NULL)) AS ', activity.id,'_experience, ',   'MAX(IF(activity.name = ''', name, ''', activitytotrip.style, NULL)) AS ', activity.id, '_style' ) as output FROM activity, activitytotrip WHERE activitytotrip.trip_id = ? AND activitytotrip.activity_id = activity.id ORDER BY activity.id ) as temp", [searchTripId]);
    const [activitiesRows]: [RowDataPacket[], FieldPacket[]] = await conn.query('SELECT @sql');

    // eslint-disable-next-line no-param-reassign
    conn.config.namedPlaceholders = true;

    // All query values to pass to inital query
    // Lat lng min max based off https://www.movable-type.co.uk/scripts/latlong-db.html
    const queryValues = {
      trip_id: searchTripId,
      lat_min: searchTrip.lat - (maxDistance / R) * rad2deg,
      lat_max: searchTrip.lat + (maxDistance / R) * rad2deg,
      lng_min: searchTrip.lng - ((maxDistance / R) * rad2deg) / Math.cos(searchTrip.lat * deg2rad),
      lng_max: searchTrip.lng + ((maxDistance / R) * rad2deg) / Math.cos(searchTrip.lat * deg2rad),
      start_date: searchTrip.start_date,
      end_date: searchTrip.end_date,
    };

    // Required if there are no activites so only adds comma if they exist
    let activityQueryAddition = '';
    if (activitiesRows[0]['@sql']) {
      activityQueryAddition = `, ${activitiesRows[0]['@sql']}`;
    }

    // Query for data to create data matrix or calculated values
    const [filterRows]: [RowDataPacket[], FieldPacket[]] = await conn.execute(`SELECT trip.id, trip.lat, trip.lng, DATEOVERLAP(trip.start_date, trip.end_date, :start_date, :end_date) as overlap${activityQueryAddition} FROM trip LEFT JOIN activitytotrip ON trip.id = activitytotrip.trip_id LEFT JOIN activity ON activitytotrip.activity_id = activity.id WHERE lat Between :lat_min And :lat_max  And lng Between :lng_min And :lng_max AND trip.id <> :trip_id AND DATEOVERLAP(trip.start_date, trip.end_date, :start_date, :end_date) > 0 GROUP BY trip.id;`, queryValues);

    // eslint-disable-next-line no-param-reassign
    conn.config.namedPlaceholders = false;

    // Plus 1 as same day counts
    const tripLength = DaysBetweenDates(searchTrip.start_date, searchTrip.end_date) + 1;

    // Normalisation vector to Normalise all vectors from rows between 1 and 0
    const normVector = [1, WrapInfTo0(1 / tripLength), WrapInfTo0(1 / searchTrip.activites.length), WrapInfTo0(1 / (2 * searchTrip.activites.length))];

    const weightVector = [1, 1, 0.25, 1];

    const weightedTripVector = HadamardProduct(normVector, weightVector);

    // Results from dot product with result and trip_id
    const dotResults: Map<number, [number, number]> = new Map<number, [number, number]>();

    filterRows.forEach((r) => {
      // Calculated components

      const distance = (SphericalCosine(r.lat, r.lng, searchTrip.lat, searchTrip.lng));

      // Skips row if outside max distance
      if (distance > maxDistance) {
        return;
      }

      // Distance is 1 - fraction of max weight to get contribution between 1 and 0
      const distanceComponent = 1 - distance / maxDistance;

      // Component of number of shared activites
      let sharedActivites = 0;
      // Component based on details similarity in shared activites
      let activitesDetailsComponent = 0;

      // Calculates actitivite components
      searchTrip.activites.forEach((a) => {
        // Checks if activity exists on trip row
        if (r[`${a.activityCategory.type_id}_style`]) {
          sharedActivites += 1;
          activitesDetailsComponent += a.StyleStr === r[`${a.activityCategory.type_id}_style`] ? 1 : 0;
          activitesDetailsComponent += ExperienceSimilarity(StrToExperience(a.experience), StrToExperience(r[`${a.activityCategory.type_id}_experience`]));
        }
      });

      const rowVector = [distanceComponent, r.overlap, sharedActivites, activitesDetailsComponent];

      dotResults.set(DotProduct(rowVector, weightedTripVector), [r.id, distance]);
    });

    // Sort trips by dotProduct
    const sortedTrips = new Map<number, [number, number]>([...dotResults.entries()].sort((a, b) => b[0] - a[0]));

    const results = [];

    // Fetches search results from sorted dictionary

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of sortedTrips.entries()) {
      results.push(FetchSearchResult(value[0], value[1], conn));
    }

    return Promise.all(results);
  }, parentConn);
}
