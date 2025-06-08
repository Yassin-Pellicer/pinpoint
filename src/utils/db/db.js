import { Pool } from "pg";

let pool;

/**
 * Initializes a singleton connection pool to the PostgreSQL database
 * with the specified environment variables. If the pool has already
 * been initialized, it returns the existing pool. The pool is
 * configured with a maximum of 10 connections and SSL is enabled
 * with unauthorized certificates being accepted.
 *
 * @returns {Pool} The initialized or existing PostgreSQL connection pool.
 */

function initPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
      max: 10,
    });
  }
  return pool;
}

/**
 * Connects to the PostgreSQL database.
 * @returns {Promise<import("pg").Client>} Resolves with a connected client.
 */

export async function connectToDatabase() {
  const poolInstance = initPool();
  const client = await poolInstance.connect();
  return client;
}

export const dbPool = initPool();
