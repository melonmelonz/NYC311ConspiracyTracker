import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// The app is intentionally configured through DATABASE_URL so local, hosted,
// and containerized PostgreSQL deployments all use the same connection path.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.PGSSLMODE === 'require'
      ? {
          rejectUnauthorized: false
        }
      : false
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error.message);
});

export const query = (text, params) => pool.query(text, params);
