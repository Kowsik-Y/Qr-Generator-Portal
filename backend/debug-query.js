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
    console.log('=== TESTING QUESTION FILTERING ===');

    // Test the exact query from questionController.js
    const query = `
      SELECT q.id, q.test_id, q.question_type, q.question_text, q.code_language, q.options, q.points, q.order_number, q.test_cases
      FROM questions q
      JOIN test_attempts ta ON ta.test_id = q.test_id
      WHERE q.test_id = $1 AND ta.id = $2 AND ta.student_id = $3
      AND (ta.selected_questions IS NULL OR q.id = ANY(ta.selected_questions))
      ORDER BY q.order_number ASC
    `;

    const result = await pool.query(query, [32, 45, 7]);
    console.log('Questions returned by filtered query:', result.rows.length);
    console.log('Question IDs:', result.rows.map(r => r.id));

    // Also test what happens without the filter
    const allQuery = 'SELECT id FROM questions WHERE test_id = $1 ORDER BY order_number ASC';
    const allResult = await pool.query(allQuery, [32]);
    console.log('Total questions in test:', allResult.rows.length);
    console.log('All question IDs:', allResult.rows.map(r => r.id));

    // Check the selected_questions value
    const attemptQuery = 'SELECT selected_questions FROM test_attempts WHERE id = $1';
    const attemptResult = await pool.query(attemptQuery, [45]);
    console.log('Selected questions for attempt 45:', attemptResult.rows[0].selected_questions);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    pool.end();
  }
})();