const { Pool } = require('pg');

// If DATABASE_URL is provided (Heroku-style), use it. Otherwise use individual PG_* vars.
const connectionString = process.env.DATABASE_URL;

const pool = connectionString
  ? new Pool({
      connectionString,
      // Enable SSL in production when using managed DBs that require it.
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })
  : new Pool({
      host: process.env.PGHOST || 'localhost',
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || '',
      database: process.env.PGDATABASE || 'postgres',
      port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
    });

module.exports = pool;
