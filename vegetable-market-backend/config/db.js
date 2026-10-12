const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'vegetable_market',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  // PostgreSQL connection pooling defaults are suitable for local development.
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error.message);
});

module.exports = pool;
