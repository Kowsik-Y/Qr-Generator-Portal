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
    console.log('=== TEST CONFIGURATION ===');
    const testResult = await pool.query('SELECT id, title, questions_to_ask FROM tests WHERE id = $1', [32]);
    console.log('Test:', testResult.rows[0]);

    const questionCount = await pool.query('SELECT COUNT(*) as count FROM questions WHERE test_id = $1', [32]);
    console.log('Total questions in test:', questionCount.rows[0].count);

    console.log('\n=== RECENT ATTEMPTS ===');
    const attempts = await pool.query('SELECT id, student_id, selected_questions, status FROM test_attempts WHERE test_id = $1 ORDER BY started_at DESC LIMIT 5', [32]);
    attempts.rows.forEach(attempt => {
      console.log('Attempt ID:', attempt.id, '| Student:', attempt.student_id, '| Status:', attempt.status);
      console.log('Selected questions:', attempt.selected_questions);
      console.log('---');
    });

    if (attempts.rows.length > 0 && attempts.rows[0].selected_questions) {
      console.log('\n=== QUESTION FILTERING TEST ===');
      const selectedIds = attempts.rows[0].selected_questions;
      console.log('Selected question IDs:', selectedIds);
      console.log('Number of selected questions:', selectedIds.length);

      const questionCheck = await pool.query('SELECT id FROM questions WHERE test_id = $1 AND id = ANY($2)', [32, selectedIds]);
      console.log('Questions found in database:', questionCheck.rows.map(r => r.id));
    }

  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    pool.end();
  }
})();