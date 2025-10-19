const db = require('../config/database');

// Get all tests (with filters)
exports.getAllTests = async (req, res) => {
  try {
    const { course_id } = req.query;
    
    // Teachers and admins see all tests (including inactive)
    // Students only see active tests
    const userRole = req.user?.role || 'student';
    const isTeacherOrAdmin = userRole === 'teacher' || userRole === 'admin';
    
    let query = `
      SELECT t.*, c.title as course_title,
        (SELECT COUNT(*) FROM questions WHERE test_id = t.id) as question_count
      FROM tests t
      LEFT JOIN courses c ON t.course_id = c.id
      WHERE 1=1
    `;
    
    // Students only see active tests
    if (!isTeacherOrAdmin) {
      query += ' AND t.is_active = true';
    }
    
    const params = [];
    
    if (course_id) {
      params.push(course_id);
      query += ` AND t.course_id = $${params.length}`;
    }
    
    query += ' ORDER BY t.created_at DESC';

    const result = await db.query(query, params);
    res.json({ tests: result.rows });
  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
};

// Get test by ID
exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT t.*, c.title as course_title
      FROM tests t
      LEFT JOIN courses c ON t.course_id = c.id
      WHERE t.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Test not found' });
    }

    res.json({ test: result.rows[0] });
  } catch (error) {
    console.error('Get test error:', error);
    res.status(500).json({ error: 'Failed to fetch test' });
  }
};

// Create test
exports.createTest = async (req, res) => {
  try {
    const {
      course_id,
      title,
      description,
      quiz_type,
      test_type,
      duration_minutes,
      start_time,
      end_time,
      passing_score,
      platform_restriction,
      allowed_browsers,
      max_attempts,
      detect_window_switch,
      prevent_screenshot,
      detect_phone_call
    } = req.body;

    if (!title || !quiz_type || !test_type || !duration_minutes) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const createdBy = req.user ? req.user.id : null;

    // Convert empty strings to null for timestamp fields
    const startTime = start_time && start_time.trim() !== '' ? start_time : null;
    const endTime = end_time && end_time.trim() !== '' ? end_time : null;

    const result = await db.query(`
      INSERT INTO tests (
        course_id, title, description, quiz_type, test_type,
        duration_minutes, start_time, end_time, passing_score,
        platform_restriction, allowed_browsers, created_by,
        max_attempts, detect_window_switch, prevent_screenshot, detect_phone_call
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `, [
      course_id, title, description, quiz_type, test_type,
      duration_minutes, startTime, endTime, passing_score,
      platform_restriction, allowed_browsers, createdBy,
      max_attempts, detect_window_switch, prevent_screenshot, detect_phone_call
    ]);

    res.status(201).json({
      message: 'Test created successfully',
      test: result.rows[0]
    });
  } catch (error) {
    console.error('Create test error:', error);
    res.status(500).json({ error: 'Failed to create test' });
  }
};

// Update test
exports.updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Convert empty strings to null for timestamp fields
    if (updates.start_time !== undefined && updates.start_time === '') {
      updates.start_time = null;
    }
    if (updates.end_time !== undefined && updates.end_time === '') {
      updates.end_time = null;
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
      UPDATE tests
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Test not found' });
    }

    res.json({
      message: 'Test updated successfully',
      test: result.rows[0]
    });
  } catch (error) {
    console.error('Update test error:', error);
    res.status(500).json({ error: 'Failed to update test' });
  }
};

// Delete test
exports.deleteTest = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM tests WHERE id = $1', [id]);

    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    console.error('Delete test error:', error);
    res.status(500).json({ error: 'Failed to delete test' });
  }
};
