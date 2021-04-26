import { FieldPacket, RowDataPacket } from 'mysql2';
import { PartialTrip, Trip } from '../../../shared/Trip';
import { DateToYMDString } from '../../../shared/Utils/Date';
import { getDb } from '../db';

/**
 * Creates a new trip in DB.
 * @param user_id user_id of user creating trip
 * @param partialTrip trip details minus uuid
 */
export async function CreateTrip(user_id: number, partialTrip: PartialTrip): Promise<Trip> {
  let conn = null;
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    name, start_date, end_date, lat, lng, text_loc,
  } = partialTrip;
  try {
    conn = await getDb().getConnection();

    await conn.beginTransaction();

    await conn.execute(`INSERT INTO trip 
    (uuid, name, start_date, end_date, lat, lng, text_loc, user_id) 
    VALUES(UUID_TO_BIN(UUID()),?,?,?,?,?,?)`,
    [name, DateToYMDString(new Date(start_date)), DateToYMDString(new Date(end_date)), lat, lng, text_loc, user_id]);

    // Need to get uuid for trip object
    const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.execute('SELECT * FROM trip WHERE id = LAST_INSERT_ID()');

    // Expands partial  trip plus uuid to make full trip
    const newTrip = new Trip({ uuid: rows[0].uuid, ...partialTrip });

    await conn.commit();

    return newTrip;
  } catch (e) {
    if (conn) { await conn.rollback(); }

    console.log(e);
    throw e;
  } finally {
    if (conn) { conn.release(); }
  }
}

export async function FindAllTrips(user_id : number): Promise<Trip[]> {
  let conn = null;
  try {
    conn = await getDb().getConnection();

    await conn.beginTransaction();

    // Get trip rows
    const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.execute('SELECT * FROM trip WHERE user_id = ?', [user_id]);

    // Turn rows into array of trips
    let newTrips: Trip[] = [];
    rows.forEach((r) => {
      newTrips.push(r as Trip);
    });

    if (newTrips.length === 0) { newTrips = []; }

    await conn.commit();

    return newTrips;
  } catch (e) {
    if (conn) { await conn.rollback(); }

    console.log(e);
    throw e;
  } finally {
    if (conn) { conn.release(); }
  }
}
