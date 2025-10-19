const db = require('../config/database');

// Get questions for a test
exports.getQuestions = async (req, res) => {
  try {
    const { test_id } = req.query;

    if (!test_id) {
      return res.status(400).json({ error: 'test_id is required' });
    }

    // Check if user is taking the test (student) or creating it (teacher)
    const isStudent = req.user.role === 'student';

    let query;
    if (isStudent) {
      // Students don't see correct answers or test cases
      query = `
        SELECT id, test_id, question_type, question_text, code_language, options, points, order_number
        FROM questions
        WHERE test_id = $1
        ORDER BY order_number ASC
      `;
    } else {
      // Teachers/admins see everything
      query = `
        SELECT *
        FROM questions
        WHERE test_id = $1
        ORDER BY order_number ASC
      `;
    }

    const result = await db.query(query, [test_id]);

    res.json({ questions: result.rows });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

// Create question
exports.createQuestion = async (req, res) => {
  try {
    const {
      test_id,
      question_type,
      question_text,
      code_language,
      options,
      correct_answer,
      test_cases,
      explanation,
      points
    } = req.body;

    if (!test_id || !question_type || !question_text || !correct_answer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get next order number
    const orderResult = await db.query(
      'SELECT COALESCE(MAX(order_number), 0) + 1 as next_order FROM questions WHERE test_id = $1',
      [test_id]
    );
    const order_number = orderResult.rows[0].next_order;

    const result = await db.query(`
      INSERT INTO questions (
        test_id, question_type, question_text, code_language,
        options, correct_answer, test_cases, explanation, points, order_number
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      test_id, question_type, question_text, code_language,
      JSON.stringify(options), correct_answer,
      JSON.stringify(test_cases), explanation,
      points || 1, order_number
    ]);

    res.status(201).json({
      message: 'Question created successfully',
      question: result.rows[0]
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
};

// Update question
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.options) {
      updates.options = JSON.stringify(updates.options);
    }
    if (updates.test_cases) {
      updates.test_cases = JSON.stringify(updates.test_cases);
    }

    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const query = `
      UPDATE questions
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({
      message: 'Question updated successfully',
      question: result.rows[0]
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
};

// Delete question
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM questions WHERE id = $1', [id]);

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
};
