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
    const attempts = await pool.query('SELECT id, student_id, selected_questions, status, started_at FROM test_attempts WHERE test_id = $1 ORDER BY started_at DESC', [32]);
    console.log('All attempts for test 32:');
    attempts.rows.forEach(attempt => {
      console.log('ID:', attempt.id, 'Student:', attempt.student_id, 'Status:', attempt.status, 'Started:', attempt.started_at);
      console.log('Selected questions:', attempt.selected_questions ? attempt.selected_questions.length + ' questions' : 'null');
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    pool.end();
  }
})();