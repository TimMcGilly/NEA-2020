import mysql from 'mysql2';
import dotenv from 'dotenv';
import { Pool } from 'mysql2/promise';

dotenv.config();

let pool : Pool;

export function initDb() {
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

export function getDb(): Pool {
  if (pool === undefined) {
    throw new Error('Failed to init db');
  }
  return pool;
}
