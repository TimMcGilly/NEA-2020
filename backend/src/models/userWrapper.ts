import { FieldPacket, RowDataPacket } from 'mysql2';
import { SimpleDBTransactionWrapper } from '../db';
import { PrivateUserDetails } from '../../../shared';

export async function GetPrivateUserDetails(userAuth0Id : string): Promise<PrivateUserDetails> {
  return SimpleDBTransactionWrapper<PrivateUserDetails>(async (conn) => {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.execute('SELECT name, BIN_TO_UUID(uuid, true) AS uuid, date_of_birth, bio_description FROM user WHERE auth0_id = ?', [userAuth0Id]);
    return new PrivateUserDetails(rows[0] as PrivateUserDetails);
  });
}
