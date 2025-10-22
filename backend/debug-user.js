const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432
});

(async () => {
  try {
    const result = await pool.query('SELECT id, name, role FROM users WHERE id = $1', [7]);
    console.log('User 7 details:', result.rows[0]);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    pool.end();
  }
})();