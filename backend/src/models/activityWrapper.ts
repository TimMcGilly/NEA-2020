import { FieldPacket, RowDataPacket } from 'mysql2';
import { SimpleDBTransactionWrapper } from '../db';
import { ActivityCategory } from '../../../shared';

export async function GetActivityCategories(): Promise<ActivityCategory[]> {
  return SimpleDBTransactionWrapper<ActivityCategory[]>(async (conn) => {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.execute('SELECT id, name, faicon FROM activity;');

    const activityCategories: ActivityCategory[] = [];
    rows.forEach((row) => activityCategories.push(new ActivityCategory(
      {
        type_id: row.id,
        name: row.name,
        faicon: row.faicon,
      },
    )));

    return activityCategories;
  });
}
