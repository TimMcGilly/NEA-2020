import { getDb } from 'db';
import { FieldPacket, RowDataPacket } from 'mysql2';

/**
 * Fetches DB user ID linked to Auth0 sub id
 * @param sub Auth0 sub user id
 */
export async function GetUserIDFromSub(sub: string): Promise<number> {
  const [rows]: [RowDataPacket[], FieldPacket[]] = await getDb().execute('SELECT id FROM user WHERE auth0_id = ?', sub);
  return rows[0][0];
}
