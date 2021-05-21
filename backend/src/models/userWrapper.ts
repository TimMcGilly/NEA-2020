import { FieldPacket, RowDataPacket } from 'mysql2';
import { SimpleDBTransactionWrapper, SimpleWrapperConn } from '../db';
import { PrivateUserDetails } from '../../../shared';

export async function GetPrivateUserDetails(userAuth0Id : string, parentConn?: SimpleWrapperConn): Promise<PrivateUserDetails> {
  return SimpleDBTransactionWrapper<PrivateUserDetails>(async (conn) => {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.execute('SELECT name, BIN_TO_UUID(uuid, true) AS uuid, date_of_birth, bio_description, avatar FROM user WHERE auth0_id = ?', [userAuth0Id]);
    return new PrivateUserDetails(rows[0] as PrivateUserDetails);
  }, parentConn);
}
