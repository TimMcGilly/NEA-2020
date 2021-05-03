/**
 * Wrapper for trip CRUD functions used in requests
 */

import { FieldPacket, RowDataPacket } from 'mysql2';
import { PartialTrip, Trip } from '../../../shared/Models/Trip';
import { DateToYMDString } from '../../../shared/Utils/Date';
import { SimpleDBTransactionWrapper } from '../db';

/**
 * Creates a new trip in DB.
 * @param user_id user_id of user creating trip
 * @param partialTrip trip details minus uuid
 */
export async function CreateTrip(user_id: number, partialTrip: PartialTrip): Promise<Trip> {
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    name, start_date, end_date, lat, lng, text_loc,
  } = partialTrip;

  return SimpleDBTransactionWrapper<Trip>(async (conn) => {
    await conn.execute(`INSERT INTO trip 
    (uuid, name, start_date, end_date, lat, lng, text_loc, user_id) 
    VALUES(UUID_TO_BIN(UUID()),?,?,?,?,?,?,?)`,
    [name, DateToYMDString(new Date(start_date)), DateToYMDString(new Date(end_date)), lat, lng, text_loc, user_id]);

    // Need to get uuid for trip object
    const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.execute('SELECT BIN_TO_UUID(uuid, true) AS uuid FROM trip WHERE id = LAST_INSERT_ID()');

    // Expands partial  trip plus uuid to make full trip
    const newTrip = new Trip({ uuid: rows[0].uuid, ...partialTrip });

    return newTrip;
  });
}

/**
 * Gets all trips for user from DB
 * @param user_id DB user_id for who to fetch trips
 * @returns Array of trips for user
 */
export async function FindAllTrips(user_id : number): Promise<Trip[]> {
  return SimpleDBTransactionWrapper<Trip[]>(async (conn) => {
    // Get trip rows
    const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.execute('SELECT BIN_TO_UUID(uuid, true) AS uuid, name, start_date, end_date, lat, lng, text_loc, user_id FROM trip WHERE user_id = ?', [user_id]);

    // Turn rows into array of trips
    let newTrips: Trip[] = [];
    rows.forEach((r) => {
      newTrips.push(r as Trip);
    });

    if (newTrips.length === 0) { newTrips = []; }
    return newTrips;
  });
}
