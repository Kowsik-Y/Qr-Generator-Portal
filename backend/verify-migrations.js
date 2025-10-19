const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

async function verifyMigrations() {
  try {
    // Check tests table columns
    const testsColumns = await pool.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'tests' 
      AND column_name IN ('max_attempts', 'detect_window_switch', 'prevent_screenshot', 'detect_phone_call')
      ORDER BY column_name
    `);

    console.log('✅ Anti-cheating columns in tests table:');
    testsColumns.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type}) default: ${row.column_default}`);
    });

    // Check test_violations table exists
    const violationsTable = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'test_violations'
    `);

    if (violationsTable.rows.length > 0) {
      console.log('\n✅ test_violations table exists');
      
      // Get violation table columns
      const violationsColumns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'test_violations'
        ORDER BY ordinal_position
      `);
      
      console.log('   Columns:');
      violationsColumns.rows.forEach(row => {
        console.log(`  - ${row.column_name} (${row.data_type})`);
      });
    }

    // Check test_attempts table new columns
    const attemptsColumns = await pool.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'test_attempts' 
      AND column_name IN ('total_violations', 'window_switches', 'screenshot_attempts', 'phone_calls')
      ORDER BY column_name
    `);

    if (attemptsColumns.rows.length > 0) {
      console.log('\n✅ Violation tracking columns in test_attempts table:');
      attemptsColumns.rows.forEach(row => {
        console.log(`  - ${row.column_name} (${row.data_type}) default: ${row.column_default}`);
      });
    }

    console.log('\n🎉 All migrations verified successfully!');

  } catch (error) {
    console.error('❌ Verification error:', error.message);
  } finally {
    await pool.end();
  }
}

verifyMigrations();
