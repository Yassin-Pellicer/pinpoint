// utils/db/db.js
import { Pool } from "pg";

const globalForPg = globalThis;

const pool =
  globalForPg.pgPool ??
  new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
    max: 10,
  });

if (!globalForPg.pgPool) {
  globalForPg.pgPool = pool;
}

export const connectToDatabase = async () => {
  const client = await pool.connect();
  console.log(`Connected clients: ${pool.totalCount}`);
  return client;
};
