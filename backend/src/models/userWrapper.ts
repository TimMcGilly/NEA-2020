import { FieldPacket, RowDataPacket } from 'mysql2';
import { extname } from 'path';
import { promises as fs } from 'fs';
import { SimpleDBTransactionWrapper, SimpleWrapperConn } from '../db';
import { PrivateUserDetails } from '../../../shared';
import * as AuthManager from '../authManager';

export async function GetPrivateUserDetails(userAuth0Id : string, parentConn?: SimpleWrapperConn): Promise<PrivateUserDetails> {
  return SimpleDBTransactionWrapper<PrivateUserDetails>(async (conn) => {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.execute('SELECT name, BIN_TO_UUID(uuid, true) AS uuid, date_of_birth, bio_description, avatar FROM user WHERE auth0_id = ?', [userAuth0Id]);
    return new PrivateUserDetails(rows[0] as PrivateUserDetails);
  }, parentConn);
}

export async function OnboardUser(auth0_id: string, name: string, date_of_birth: Date, bio_description: string, avatarFile: Express.Multer.File): Promise<void> {
  return SimpleDBTransactionWrapper<void>(async (conn) => {
    // Inserts new user
    await conn.execute('INSERT INTO user(auth0_id, uuid, name, date_of_birth, bio_description) VALUES (?,UUID_TO_BIN(UUID()),?,?,?)', [auth0_id, name, date_of_birth, bio_description]);

    // Updates avatar file name to use user uuid
    const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.execute('SELECT BIN_TO_UUID(uuid, true) AS uuid FROM user WHERE id = LAST_INSERT_ID()');
    const newFileName = rows[0].uuid + extname(avatarFile.originalname);
    await fs.rename(avatarFile.path, avatarFile.destination + newFileName);

    await conn.execute('UPDATE user SET avatar = ? WHERE id = LAST_INSERT_ID()', [newFileName]);
    // Updates auth0 onboarded metabads
    AuthManager.updateAppMetadata(auth0_id, { onboarded: true });
  });
}
