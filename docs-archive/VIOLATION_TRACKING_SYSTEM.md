# Violation Tracking System - Implementation Summary

## 🎯 Overview

This system tracks and records anti-cheating violations during test attempts, including:
- Window/tab switches
- Screenshot attempts
- Phone calls during test
- Copy/paste attempts
- Other suspicious activities

---

## ✅ What Has Been Created

### 1. Database Migration
**File:** `backend/database/migrations/005_add_test_violations_table.sql`

#### New Table: `test_violations`
Stores individual violation records with:
- `id` - Primary key
- `attempt_id` - Links to test attempt
- `user_id` - Student who committed violation
- `test_id` - Test where violation occurred
- `violation_type` - Type: window_switch, screenshot_attempt, phone_call, tab_switch, copy_paste, other
- `violation_count` - Number of occurrences
- `details` - JSON field for extra context (timestamps, duration, caller number, etc.)
- `severity` - Level: low, medium, high, critical
- `created_at` - Timestamp

#### Updated Table: `test_attempts`
Added summary columns:
- `total_violations` - Total count of all violations
- `window_switches` - Count of window/tab switches
- `screenshot_attempts` - Count of screenshot attempts
- `phone_calls` - Count of phone calls
- `violation_flags` - JSON flags for additional violation types

### 2. Backend Controller
**File:** `backend/src/controllers/violationController.js`

**Functions:**
- `recordViolation()` - Record a single violation
- `recordBulkViolations()` - Record multiple violations at once
- `getAttemptViolations()` - Get all violations for a specific attempt
- `getTestViolations()` - Get all violations for a test (with statistics)
- `getUserViolations()` - Get all violations for a specific user

**Features:**
- Automatic violation counting
- Updates both `test_violations` table and `test_attempts` summary
- Includes statistics and aggregations
- Proper error handling

### 3. Backend Routes
**File:** `backend/src/routes/violations.js`

**Endpoints:**
```
POST   /api/violations/record          - Record single violation
POST   /api/violations/bulk            - Record multiple violations
GET    /api/violations/attempt/:id     - Get violations for attempt
GET    /api/violations/test/:id        - Get violations for test
GET    /api/violations/user/:id        - Get violations for user
```

All routes require authentication.

### 4. Frontend API Service
**File:** `native/lib/violationAPI.ts`

**TypeScript API Functions:**
- `recordViolation()` - Send single violation to backend
- `recordBulkViolations()` - Send multiple violations
- `getAttemptViolations()` - Fetch attempt violations
- `getTestViolations()` - Fetch test violations with stats
- `getUserViolations()` - Fetch user violation history

**Type Safety:**
- Proper TypeScript types for violation data
- Enum-like types for violation_type and severity
- Full intellisense support

### 5. Server Configuration
**File:** `backend/src/server.js`

Added violation routes to Express app:
- Imported `violationRoutes`
- Registered at `/api/violations`

---

## 🔧 How It Works

### Recording Violations Flow

1. **During Test Taking:**
   ```typescript
   // When student switches window
   await violationAPI.recordViolation({
     attempt_id: currentAttemptId,
     test_id: testId,
     violation_type: 'window_switch',
     details: { timestamp: new Date().toISOString() },
     severity: 'medium'
   });
   ```

2. **Backend Processing:**
   - Inserts record into `test_violations` table
   - Updates counters in `test_attempts` table
   - Returns confirmation

3. **Viewing Violations:**
   ```typescript
   // Get violations for an attempt
   const { violations, summary } = await violationAPI.getAttemptViolations(attemptId);
   
   // violations = array of violation records
   // summary = { total_violations, window_switches, screenshot_attempts, phone_calls }
   ```

### Violation Types

| Type | Description | Default Severity | Platform |
|------|-------------|------------------|----------|
| `window_switch` | User switched to another window | Medium | Web |
| `tab_switch` | User switched browser tab | Medium | Web |
| `screenshot_attempt` | Tried to take screenshot | High | Mobile |
| `phone_call` | Received/made phone call | High | Mobile |
| `copy_paste` | Attempted copy/paste | Low | All |
| `other` | Other suspicious activity | Medium | All |

---

## 📱 Implementation in Test-Taking Pages

### Example: Window Switch Detection (Web)

```typescript
import { violationAPI } from '../lib/violationAPI';
import { useEffect } from 'react';

export default function TakeTest() {
  const [attemptId, setAttemptId] = useState(null);
  const [testId, setTestId] = useState(null);

  useEffect(() => {
    // Detect window blur (user switched away)
    const handleWindowBlur = async () => {
      if (attemptId && testId) {
        try {
          await violationAPI.recordViolation({
            attempt_id: attemptId,
            test_id: testId,
            violation_type: 'window_switch',
            details: {
              timestamp: new Date().toISOString(),
              action: 'window_blur'
            },
            severity: 'medium'
          });
          console.log('Window switch recorded');
        } catch (error) {
          console.error('Failed to record violation:', error);
        }
      }
    };

    window.addEventListener('blur', handleWindowBlur);
    
    return () => {
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [attemptId, testId]);

  // Rest of component...
}
```

### Example: Screenshot Prevention (Mobile)

```typescript
import * as ScreenCapture from 'expo-screen-capture';
import { violationAPI } from '../lib/violationAPI';

export default function TakeTestMobile() {
  useEffect(() => {
    // Prevent screenshots
    const preventScreenshots = async () => {
      try {
        await ScreenCapture.preventScreenCaptureAsync();
        
        // Listen for screenshot attempts (if supported)
        const subscription = ScreenCapture.addScreenCaptureListener(async () => {
          // Record violation
          await violationAPI.recordViolation({
            attempt_id: attemptId,
            test_id: testId,
            violation_type: 'screenshot_attempt',
            details: {
              timestamp: new Date().toISOString()
            },
            severity: 'high'
          });
        });

        return () => subscription.remove();
      } catch (error) {
        console.error('Screenshot prevention error:', error);
      }
    };

    if (testData?.prevent_screenshot) {
      preventScreenshots();
    }
  }, [testData, attemptId, testId]);
}
```

### Example: Phone Call Detection (Mobile)

```typescript
import CallDetector from 'react-native-call-detection';
import { violationAPI } from '../lib/violationAPI';

export default function TakeTestMobile() {
  useEffect(() => {
    let callDetector;

    const startCallDetection = () => {
      callDetector = new CallDetector();
      
      callDetector.startListener((event, phoneNumber) => {
        if (event === 'Connected' || event === 'Incoming') {
          // Record phone call violation
          violationAPI.recordViolation({
            attempt_id: attemptId,
            test_id: testId,
            violation_type: 'phone_call',
            details: {
              timestamp: new Date().toISOString(),
              event: event,
              // Don't store full number for privacy
              hasNumber: !!phoneNumber
            },
            severity: 'high'
          });
        }
      });
    };

    if (testData?.detect_phone_call) {
      startCallDetection();
    }

    return () => {
      if (callDetector) {
        callDetector.dispose();
      }
    };
  }, [testData, attemptId, testId]);
}
```

---

## 📊 Viewing Violations (Admin/Teacher Dashboard)

### Example: View Violations for a Test Attempt

```typescript
import { violationAPI } from '../lib/violationAPI';

export default function AttemptDetails() {
  const [violations, setViolations] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const loadViolations = async () => {
      try {
        const data = await violationAPI.getAttemptViolations(attemptId);
        setViolations(data.violations);
        setSummary(data.summary);
      } catch (error) {
        console.error('Failed to load violations:', error);
      }
    };

    loadViolations();
  }, [attemptId]);

  return (
    <View>
      {/* Violation Summary */}
      <View className="bg-card p-4 rounded-xl border border-border mb-4">
        <Text className="text-lg font-bold mb-2">Security Summary</Text>
        <View className="gap-2">
          <View className="flex-row justify-between">
            <Text>Total Violations:</Text>
            <Text className="font-bold">{summary?.total_violations || 0}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text>Window Switches:</Text>
            <Text className="font-bold">{summary?.window_switches || 0}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text>Screenshot Attempts:</Text>
            <Text className="font-bold">{summary?.screenshot_attempts || 0}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text>Phone Calls:</Text>
            <Text className="font-bold">{summary?.phone_calls || 0}</Text>
          </View>
        </View>
      </View>

      {/* Violation Log */}
      <View className="bg-card p-4 rounded-xl border border-border">
        <Text className="text-lg font-bold mb-4">Violation Log</Text>
        {violations.map((v) => (
          <View key={v.id} className="mb-3 pb-3 border-b border-border">
            <View className="flex-row justify-between mb-1">
              <Text className="font-semibold">{v.violation_type.replace('_', ' ')}</Text>
              <Text className={`text-xs px-2 py-1 rounded ${
                v.severity === 'high' ? 'bg-red-100 text-red-800' :
                v.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {v.severity}
              </Text>
            </View>
            <Text className="text-xs text-muted-foreground">
              {new Date(v.created_at).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
```

---

## 🚀 Next Steps to Complete Implementation

### 1. Run Database Migrations

**Run both migrations:**
```sql
-- Migration 004: Anti-cheating fields for tests table
-- Migration 005: Violations tracking table
```

Connect to your database and run:
```bash
psql -U [username] -d qr_generator_portal -f backend/database/migrations/004_add_anti_cheating_fields.sql
psql -U [username] -d qr_generator_portal -f backend/database/migrations/005_add_test_violations_table.sql
```

### 2. Update Test-Taking Pages

Add violation tracking to:
- `native/app/take-test.tsx` (Web test taking)
- `native/app/take-quiz.tsx` (Mobile test taking)

Implement:
- Window blur detection (web)
- Tab visibility detection (web)
- Screenshot prevention + detection (mobile)
- Phone call detection (mobile)
- Copy/paste monitoring (optional)

### 3. Create Admin Dashboard Components

Create new pages:
- `native/app/violation-report.tsx` - View all violations for a test
- Add violations section to test results page
- Add violations section to student profile page

### 4. Add Notifications/Alerts

Consider adding:
- Real-time alerts when critical violations occur
- Email notifications to teachers
- Visual warnings to students (e.g., "Window switching detected")
- Automatic test submission after too many violations

### 5. Testing

Test scenarios:
- ✅ Create test with anti-cheating enabled
- ✅ Take test and trigger violations
- ✅ Verify violations are recorded in database
- ✅ View violation reports
- ✅ Check summary counts are accurate

---

## 📋 Database Schema Reference

### test_violations Table
```sql
CREATE TABLE test_violations (
  id SERIAL PRIMARY KEY,
  attempt_id INTEGER REFERENCES test_attempts(id),
  user_id INTEGER REFERENCES users(id),
  test_id INTEGER REFERENCES tests(id),
  violation_type VARCHAR(50),
  violation_count INTEGER DEFAULT 1,
  details JSONB,
  severity VARCHAR(20),
  created_at TIMESTAMP
);
```

### test_attempts Table (New Columns)
```sql
ALTER TABLE test_attempts ADD COLUMN total_violations INTEGER DEFAULT 0;
ALTER TABLE test_attempts ADD COLUMN window_switches INTEGER DEFAULT 0;
ALTER TABLE test_attempts ADD COLUMN screenshot_attempts INTEGER DEFAULT 0;
ALTER TABLE test_attempts ADD COLUMN phone_calls INTEGER DEFAULT 0;
ALTER TABLE test_attempts ADD COLUMN violation_flags JSONB DEFAULT '{}';
```

---

## 🎓 Usage Examples

### Record Window Switch
```typescript
await violationAPI.recordViolation({
  attempt_id: 123,
  test_id: 45,
  violation_type: 'window_switch',
  severity: 'medium'
});
```

### Batch Record Multiple Violations
```typescript
await violationAPI.recordBulkViolations([
  { attempt_id: 123, test_id: 45, violation_type: 'window_switch' },
  { attempt_id: 123, test_id: 45, violation_type: 'tab_switch' },
  { attempt_id: 123, test_id: 45, violation_type: 'copy_paste', severity: 'low' }
]);
```

### Get Violations Summary
```typescript
const { violations, summary } = await violationAPI.getAttemptViolations(123);
console.log(`Total violations: ${summary.total_violations}`);
console.log(`Window switches: ${summary.window_switches}`);
```

---

## ✨ Features Summary

✅ **Backend Complete:**
- Database schema with violations table
- REST API endpoints
- Controllers with business logic
- Automatic counting and aggregation

✅ **Frontend API Ready:**
- TypeScript API service
- Type-safe functions
- Error handling

🔄 **Frontend UI Pending:**
- Integration in test-taking pages
- Admin dashboard for viewing violations
- Real-time violation alerts

---

## 📝 Notes

- All violations are tied to specific test attempts
- Summary counts are automatically maintained
- Supports bulk recording for efficiency
- JSON details field allows flexible metadata
- Severity levels help prioritize violations
- Indexed for fast queries on large datasets

The violation tracking system is now fully built on the backend and ready for frontend integration!
