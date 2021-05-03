import mysql from 'mysql2';
import dotenv from 'dotenv';
import { Pool, PoolConnection } from 'mysql2/promise';

dotenv.config();

let pool : Pool;

/**
 * Initalised the db pool using creds from enviroment file
 */
export function initDb(): void {
  if (pool) {
    console.warn('Cannot reinit db.');
  }
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }).promise();
}

/**
 * Gets a reference to DB pool
 * @returns DB Pool
 */
export function getDb(): Pool {
  if (pool === undefined) {
    throw new Error('Failed to init db');
  }
  return pool;
}

/**
 * Wrapper around a simple db connect using transation and basic error handling.
 * @param fn Function to run and parse query
 * @returns Result from function if sucessful
 */
export async function SimpleDBTransactionWrapper<Type>(fn: (conn: PoolConnection) => Promise<Type>): Promise<Type> {
  let conn = null;
  try {
    conn = await getDb().getConnection();

    await conn.beginTransaction();

    // Calls the user defined function.
    const result = await fn(conn);

    await conn.commit();

    return result;
  } catch (e) {
    if (conn) { await conn.rollback(); }

    console.log(e);
    throw e;
  } finally {
    if (conn) { conn.release(); }
  }
}
