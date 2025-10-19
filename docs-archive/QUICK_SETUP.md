# Anti-Cheating & Violation Tracking - Quick Setup Guide

## 🚀 Quick Start

### Step 1: Run Database Migrations

You need to run 2 migration files:

#### Option A: Using psql Command Line

```powershell
# Navigate to migrations folder
cd "e:\MY Files\Documents\Qr-Generator-Portal\backend\database\migrations"

# Run migration 004 (anti-cheating fields for tests)
psql -U postgres -d qr_generator_portal -f 004_add_anti_cheating_fields.sql

# Run migration 005 (violations tracking table)
psql -U postgres -d qr_generator_portal -f 005_add_test_violations_table.sql
```

#### Option B: Copy-Paste SQL (If psql doesn't work)

1. Open your PostgreSQL client (pgAdmin, DBeaver, etc.)
2. Connect to `qr_generator_portal` database
3. Run these SQL commands:

**Migration 004 - Anti-Cheating Fields:**
```sql
-- Add anti-cheating fields to tests table
ALTER TABLE tests ADD COLUMN IF NOT EXISTS max_attempts INTEGER DEFAULT 1;
ALTER TABLE tests ADD COLUMN IF NOT EXISTS detect_window_switch BOOLEAN DEFAULT TRUE;
ALTER TABLE tests ADD COLUMN IF NOT EXISTS prevent_screenshot BOOLEAN DEFAULT TRUE;
ALTER TABLE tests ADD COLUMN IF NOT EXISTS detect_phone_call BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN tests.max_attempts IS 'Maximum number of attempts allowed per student';
COMMENT ON COLUMN tests.detect_window_switch IS 'Track when student switches windows/apps during test';
COMMENT ON COLUMN tests.prevent_screenshot IS 'Prevent screenshots during test (mobile only)';
COMMENT ON COLUMN tests.detect_phone_call IS 'Monitor phone calls during test (mobile only)';
```

**Migration 005 - Violations Tracking:**
```sql
-- Create violations table
CREATE TABLE IF NOT EXISTS test_violations (
  id SERIAL PRIMARY KEY,
  attempt_id INTEGER REFERENCES test_attempts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
  violation_type VARCHAR(50) NOT NULL CHECK (violation_type IN ('window_switch', 'screenshot_attempt', 'phone_call', 'tab_switch', 'copy_paste', 'other')),
  violation_count INTEGER DEFAULT 1,
  details JSONB,
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_violations_attempt ON test_violations(attempt_id);
CREATE INDEX IF NOT EXISTS idx_violations_user ON test_violations(user_id);
CREATE INDEX IF NOT EXISTS idx_violations_test ON test_violations(test_id);
CREATE INDEX IF NOT EXISTS idx_violations_type ON test_violations(violation_type);

-- Add violation summary columns to test_attempts
ALTER TABLE test_attempts ADD COLUMN IF NOT EXISTS total_violations INTEGER DEFAULT 0;
ALTER TABLE test_attempts ADD COLUMN IF NOT EXISTS window_switches INTEGER DEFAULT 0;
ALTER TABLE test_attempts ADD COLUMN IF NOT EXISTS screenshot_attempts INTEGER DEFAULT 0;
ALTER TABLE test_attempts ADD COLUMN IF NOT EXISTS phone_calls INTEGER DEFAULT 0;
ALTER TABLE test_attempts ADD COLUMN IF NOT EXISTS violation_flags JSONB DEFAULT '{}';
```

### Step 2: Restart Backend Server

```powershell
# Stop current server (Ctrl+C if running)

# Navigate to backend folder
cd "e:\MY Files\Documents\Qr-Generator-Portal\backend"

# Start server
npm run dev
```

### Step 3: Test the Features

1. **Create a Test** with anti-cheating options:
   - Open the app
   - Go to Create Test page
   - You'll see new options:
     - Max Attempts input
     - Window Switch Detection toggle
     - Screenshot Prevention toggle
     - Phone Call Detection toggle

2. **Verify Database:**
```sql
-- Check if columns exist
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'tests' 
AND column_name IN ('max_attempts', 'detect_window_switch', 'prevent_screenshot', 'detect_phone_call');

-- Check if violations table exists
SELECT * FROM information_schema.tables WHERE table_name = 'test_violations';
```

## 📊 API Endpoints Now Available

Once migrations are done, these endpoints will work:

```
POST   /api/violations/record          - Record a violation
POST   /api/violations/bulk            - Record multiple violations
GET    /api/violations/attempt/:id     - Get violations for attempt
GET    /api/violations/test/:id        - Get violations for test
GET    /api/violations/user/:id        - Get violations for user
```

## ✅ What's Working Now

After running migrations:

✅ Create tests with anti-cheating settings
✅ Set maximum attempts
✅ Enable/disable window switch detection
✅ Enable/disable screenshot prevention
✅ Enable/disable phone call detection
✅ Record violations via API
✅ View violations for attempts/tests/users

## 🔄 What Still Needs to Be Done

To have a fully working system:

1. **Update Test-Taking Pages** to actually monitor and record violations
2. **Create Admin Dashboard** to view violation reports
3. **Add Real-time Alerts** when violations occur
4. **Implement Native Features** (screenshot prevention, call detection on mobile)

## 🐛 Troubleshooting

### If psql command fails:

**Check PostgreSQL is running:**
```powershell
Get-Service -Name postgresql*
```

**Check if database exists:**
```powershell
psql -U postgres -l
```

**Manual connection:**
```powershell
psql -U postgres
# Then type:
\c qr_generator_portal
# Then paste the SQL from migrations
```

### If backend won't start:

Check for errors in terminal and ensure:
- Node modules are installed: `npm install`
- .env file has correct database credentials
- PostgreSQL is running and accessible

## 📞 Testing Violations API

Once everything is running, test with curl or Postman:

**Record a violation:**
```bash
POST http://localhost:5000/api/violations/record
Content-Type: application/json

{
  "attempt_id": 1,
  "test_id": 1,
  "violation_type": "window_switch",
  "severity": "medium"
}
```

**Get violations for attempt:**
```bash
GET http://localhost:5000/api/violations/attempt/1
```

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Migrations run without errors
2. ✅ Backend starts successfully
3. ✅ Create Test page shows all new options
4. ✅ You can create a test with anti-cheating settings
5. ✅ Test is created in database with new columns populated
6. ✅ API endpoints respond correctly

## 📚 Documentation Files Created

- `ANTI_CHEATING_IMPLEMENTATION.md` - UI and backend implementation details
- `VIOLATION_TRACKING_SYSTEM.md` - Complete violation tracking system guide
- `QUICK_SETUP.md` - This file (quick setup instructions)

Good luck! 🚀
