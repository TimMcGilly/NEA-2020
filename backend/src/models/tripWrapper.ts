/**
 * Wrapper for trip CRUD functions used in requests
 */

import { FieldPacket, RowDataPacket } from 'mysql2';
import { PartialTrip, Trip } from '../../../shared/Models/Trip';
import { DateToYMDString } from '../../../shared/Utils/Date';
import { SimpleDBTransactionWrapper, SimpleWrapperConn } from '../db';
import { GetTripActivities } from './activityWrapper';

/**
 * Creates a new trip in DB.
 * @param user_id user_id of user creating trip
 * @param partialTrip trip details minus uuid
 */
export async function CreateTrip(user_id: number, partialTrip: PartialTrip, parentConn?: SimpleWrapperConn): Promise<Trip> {
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    name, start_date, end_date, lat, lng, text_loc, activites,
  } = partialTrip;

  return SimpleDBTransactionWrapper<Trip>(async (conn) => {
    await conn.execute(`INSERT INTO trip 
    (uuid, name, start_date, end_date, lat, lng, text_loc, user_id) 
    VALUES(UUID_TO_BIN(UUID()),?,?,?,?,?,?,?)`,
    [name, DateToYMDString(new Date(start_date)), DateToYMDString(new Date(end_date)), lat, lng, text_loc, user_id]);

    // Need to get uuid for trip object
    const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.execute('SELECT BIN_TO_UUID(uuid, true) AS uuid, LAST_INSERT_ID() as DBId FROM trip WHERE id = LAST_INSERT_ID()');

    // Expands partial  trip plus uuid to make full trip
    const newTrip = new Trip({ uuid: rows[0].uuid, ...partialTrip });

    const tripDBID = rows[0].DBId;

    // Insert activity trip links
    activites.forEach(async (activity) => {
      await conn.execute('INSERT INTO activitytotrip(activity_id, trip_id, experience, style) VALUES (?, ?, ?, ?)',
        [activity.activityCategory.type_id, tripDBID, activity.experience, activity.style]);
    });

    return newTrip;
  }, parentConn);
}

/**
 * Gets all trips for user from DB
 * @param user_id DB user_id for who to fetch trips
 * @returns Array of trips for user
 */
export async function FindAllTrips(user_id : number, parentConn?: SimpleWrapperConn): Promise<Trip[]> {
  return SimpleDBTransactionWrapper<Trip[]>(async (conn) => {
    // Get trip rows
    const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.execute('SELECT id AS trip_id, BIN_TO_UUID(uuid, true) AS uuid, name, start_date, end_date, lat, lng, text_loc, user_id FROM trip WHERE user_id = ?', [user_id]);

    // Turn rows into array of trips
    let newTrips: Trip[] = [];
    rows.forEach(async (r) => {
      const activites = await GetTripActivities(r.trip_id, conn);

      // Cast db row to Trip and add activites
      newTrips.push(new Trip({ ...r as Trip, activites }));
    });

    if (newTrips.length === 0) { newTrips = []; }
    return newTrips;
  }, parentConn);
}

/**
 * Fetches full indvidual trip from db based on uuid
 * @param user_id User db id
 * @param trip_uuid trip uuid to fetch
 * @param parentConn pass through parent conn
 * @returns Trip object for uuid
 */
export async function FindTripById(user_id:number, trip_uuid: string, parentConn?: SimpleWrapperConn): Promise<Trip> {
  return SimpleDBTransactionWrapper<Trip>(async (conn) => {
    // Get trip rows
    const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.execute('SELECT id AS trip_id, BIN_TO_UUID(uuid, true) AS uuid, name, start_date, end_date, lat, lng, text_loc, user_id FROM trip WHERE user_id = ? AND uuid = UUID_TO_BIN(?, true)', [user_id, trip_uuid]);

    // Fetch trip activites
    const activites = await GetTripActivities(rows[0].trip_id, conn);

    // Cast db row to Trip and add activites
    return new Trip({ ...rows[0] as Trip, activites });
  }, parentConn);
}

/**
 * Delete trip with uuid
 * @param user_id User id of trip owner
 * @param trip_uuid trip uuid to delete
 * @param parentConn passthrough db connection
 */
export async function DeleteTripById(user_id:number, trip_uuid: string, parentConn?: SimpleWrapperConn): Promise<void> {
  return SimpleDBTransactionWrapper<void>(async (conn) => {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.execute('SELECT id AS trip_id FROM trip WHERE user_id = ? AND uuid = UUID_TO_BIN(?, true)', [user_id, trip_uuid]);
    const tripId = rows[0].trip_id;
    if (!tripId) { throw new Error('Trip missing or not owned by user'); }

    // All statments needed to ensure no orphaned data
    await conn.execute('DELETE FROM activitytotrip WHERE trip_id = ?;', [tripId]);
    await conn.execute('DELETE FROM triptogroup WHERE trip_id = ?;', [tripId]);
    await conn.execute('DELETE FROM textmessage WHERE chat IN (SELECT chat FROM usermatch WHERE trip_id1 = ? OR trip_id2 = ?);', [tripId, tripId]);
    await conn.execute('DELETE FROM blobmessage WHERE chat IN (SELECT chat FROM usermatch WHERE trip_id1 = ? OR trip_id2 = ?);', [tripId, tripId]);
    await conn.execute('DELETE FROM chat WHERE chat.id IN (SELECT chat FROM usermatch WHERE trip_id1 = ? OR trip_id2 = ?);', [tripId, tripId]);
    await conn.execute('DELETE FROM usermatch WHERE trip_id1 = ? OR trip_id2 = ?;', [tripId, tripId]);
    await conn.execute('DELETE FROM trip WHERE trip.id = ?', [tripId]);
  }, parentConn);
}
