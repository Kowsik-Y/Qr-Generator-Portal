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
    const userResult = await pool.query('SELECT id, name, role FROM users WHERE id = $1', [7]);
    console.log('User 7 details:', userResult.rows[0]);

    const testResult = await pool.query('SELECT id, title, questions_to_ask FROM tests WHERE id = $1', [32]);
    console.log('Test 32 config:', testResult.rows[0]);

    const attemptResult = await pool.query('SELECT id, selected_questions FROM test_attempts WHERE test_id = $1 AND student_id = $2 ORDER BY started_at DESC LIMIT 1', [32, 7]);
    console.log('Latest attempt for user 7 on test 32:', attemptResult.rows[0]);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    pool.end();
  }
})();