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
    // Test the exact query used when attempt_id is provided for a student
    console.log('=== TESTING STUDENT QUERY WITH ATTEMPT_ID ===');
    const studentQuery = `
      SELECT q.id, q.test_id, q.question_type, q.question_text, q.code_language, q.options, q.points, q.order_number, q.test_cases
      FROM questions q
      JOIN test_attempts ta ON ta.test_id = q.test_id
      WHERE q.test_id = $1 AND ta.id = $2 AND ta.student_id = $3
      AND (ta.selected_questions IS NULL OR q.id = ANY(ta.selected_questions))
      ORDER BY q.order_number ASC
    `;

    const studentResult = await pool.query(studentQuery, [32, 45, 7]);
    console.log('Questions returned for student with attempt 45:', studentResult.rows.length);
    console.log('Question IDs:', studentResult.rows.map(r => r.id));

    // Test what happens without attempt_id (like when viewing questions as teacher)
    console.log('\n=== TESTING TEACHER QUERY (NO ATTEMPT_ID) ===');
    const teacherQuery = 'SELECT id FROM questions WHERE test_id = $1 ORDER BY order_number ASC';
    const teacherResult = await pool.query(teacherQuery, [32]);
    console.log('Questions returned for teacher (all):', teacherResult.rows.length);
    console.log('Question IDs:', teacherResult.rows.map(r => r.id));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    pool.end();
  }
})();