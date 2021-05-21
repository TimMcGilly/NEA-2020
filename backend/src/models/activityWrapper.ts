import { FieldPacket, RowDataPacket } from 'mysql2';
import { SimpleDBTransactionWrapper, SimpleWrapperConn } from '../db';
import { Activity, ActivityCategory } from '../../../shared';

/**
 * Fetches from DB all activity catergories
 * @returns Array of all activity catergories
 */
export async function GetActivityCategories(parentConn?: SimpleWrapperConn): Promise<ActivityCategory[]> {
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
  }, parentConn);
}

export async function GetTripActivities(trip_id: number, parentConn?: SimpleWrapperConn): Promise<Activity[]> {
  return SimpleDBTransactionWrapper<Activity[]>(async (conn) => {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.execute('SELECT activity.*, activitytotrip.experience, activitytotrip.style FROM activitytotrip, activity WHERE activitytotrip.trip_id = 1 AND activitytotrip.activity_id = activity.id;');

    const activites: Activity[] = [];
    rows.forEach((row) => {
      const activityCategory = new ActivityCategory({
        type_id: row.id,
        name: row.name,
        faicon: row.faicon,
      });
      activites.push(new Activity({
        activityCategory,
        experience: row.experience,
        style: row.style,
      }));
    });
    return activites;
  }, parentConn);
}
