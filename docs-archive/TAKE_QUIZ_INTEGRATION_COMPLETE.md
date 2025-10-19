# Take Quiz Page - Backend Integration Complete! 🎉

## ✅ What Was Integrated

### 1. **Backend API Integration**

**APIs Used:**
- `testAPI` - To fetch test details and questions
- `attemptAPI` - To create attempts and submit answers
- `violationAPI` - To record anti-cheating violations

**New Imports Added:**
```typescript
import { useLocalSearchParams } from 'expo-router';
import { testAPI, attemptAPI } from '@/lib/api';
import { violationAPI } from '@/lib/violationAPI';
```

### 2. **State Management Updates**

**Added States:**
```typescript
const { testId } = useLocalSearchParams<{ testId: string }>();
const [testData, setTestData] = useState<any>(null);
const [questions, setQuestions] = useState<any[]>([]);
const [attemptId, setAttemptId] = useState<number | null>(null);
const [loading, setLoading] = useState(true);
```

### 3. **Data Loading from Backend**

**On Component Mount:**
- Fetches test details using `testAPI.getTestById(testId)`
- Fetches questions using `testAPI.getTestQuestions(testId)`
- Sets duration from backend data
- Shows loading state while fetching

**Error Handling:**
- Shows alert if test not found
- Navigates back if testId is missing
- Handles network errors gracefully

### 4. **Test Attempt Management**

**Starting Quiz:**
```typescript
// Creates test attempt when user clicks "Start Quiz"
const attempt = await attemptAPI.startAttempt({
  test_id: parseInt(testId)
});
setAttemptId(attempt.attempt.id);
```

**Submitting Answers:**
```typescript
// Submits each answer to backend
for (let i = 0; i < questions.length; i++) {
  await attemptAPI.submitAnswer({
    attempt_id: attemptId,
    question_id: question.id,
    answer: selectedAnswer
  });
}

// Gets final result
const result = await attemptAPI.getAttemptResult(attemptId);
```

### 5. **Violation Tracking Integration**

**Automatic Violation Recording:**
Every time a violation is detected, it's sent to the backend:

```typescript
await violationAPI.recordViolation({
  attempt_id: attemptId,
  test_id: parseInt(testId),
  violation_type: violationType, // window_switch, screenshot_attempt, phone_call, etc.
  details: {
    timestamp: new Date().toISOString(),
    message: violation,
    platform: Platform.OS
  },
  severity: severity // low, medium, high, critical
});
```

**Violation Type Mapping:**
| Detected Event | Violation Type | Severity |
|----------------|---------------|----------|
| Phone call detected | `phone_call` | High |
| Tab/Window switch | `window_switch` | Medium |
| Screenshot attempt | `screenshot_attempt` | High |
| Copy/Paste attempt | `copy_paste` | Low |
| Other violations | `other` | Medium |

### 6. **UI Updates**

**Loading State:**
- Shows "Loading test..." while fetching data
- Shows "Test not found" with go back button if error

**Test Information Display:**
- Title and description from backend
- Total questions count (dynamic)
- Duration in minutes
- Passing score percentage
- Total marks
- Quiz type (MCQ, Code, Mixed)
- Platform restriction (if set)

**Question Rendering:**
- Uses `question.question_text` from backend
- Parses options from JSON if needed
- Handles both string and array option formats

### 7. **Anti-Cheating Features (Integrated)**

**All existing anti-cheating features now record to backend:**

✅ **Web Platform:**
- Window/Tab switching → Recorded
- Screenshot attempts (keyboard shortcuts) → Recorded
- Right-click prevention → Recorded
- Copy/Paste attempts → Recorded
- Fullscreen exit → Recorded

✅ **Mobile Platform:**
- Screenshot prevention → Recorded
- App backgrounding → Recorded
- Phone call detection → Recorded
- Active call blocking → Enforced

---

## 📋 How It Works - Full Flow

### Step 1: Navigate to Quiz
```typescript
// From test list or details page
router.push(`/take-quiz?testId=${test.id}`);
```

### Step 2: Page Loads
1. Extracts `testId` from URL params
2. Fetches test data from backend
3. Fetches questions from backend
4. Shows loading spinner
5. Displays test information

### Step 3: Start Quiz
1. User clicks "Start Quiz"
2. Creates test attempt via API
3. Receives `attemptId`
4. Starts timer
5. Enables anti-cheating monitors

### Step 4: During Quiz
1. User answers questions
2. Selections stored locally
3. Any violations detected → sent to backend immediately
4. Timer counts down
5. Navigation between questions

### Step 5: Submit Quiz
1. User clicks "Submit" or timer expires
2. Loops through all answers
3. Submits each answer to backend
4. Gets final result with score
5. Shows result alert
6. Navigates back

---

## 🎯 Violation Recording Examples

### Example 1: Window Switch (Web)
```typescript
// Detected by visibilitychange event
document.addEventListener('visibilitychange', async () => {
  if (document.hidden) {
    await violationAPI.recordViolation({
      attempt_id: attemptId,
      test_id: parseInt(testId),
      violation_type: 'window_switch',
      details: {
        timestamp: new Date().toISOString(),
        message: 'Tab switch detected',
        platform: 'web'
      },
      severity: 'medium'
    });
  }
});
```

### Example 2: Screenshot Attempt (Mobile)
```typescript
// Detected by expo-screen-capture
ScreenCapture.addScreenshotListener(async () => {
  await violationAPI.recordViolation({
    attempt_id: attemptId,
    test_id: parseInt(testId),
    violation_type: 'screenshot_attempt',
    details: {
      timestamp: new Date().toISOString(),
      message: 'Screenshot attempt detected',
      platform: 'ios' // or 'android'
    },
    severity: 'high'
  });
});
```

### Example 3: Phone Call (Mobile)
```typescript
// Detected by call detector
callDetectorRef.current = new CallDetectorManager((event) => {
  if (event === 'Connected') {
    await violationAPI.recordViolation({
      attempt_id: attemptId,
      test_id: parseInt(testId),
      violation_type: 'phone_call',
      details: {
        timestamp: new Date().toISOString(),
        message: 'Active call detected during quiz',
        platform: 'android'
      },
      severity: 'high'
    });
  }
});
```

---

## 🔧 Backend Data Structure

### Test Data Response
```typescript
{
  id: number;
  title: string;
  description: string;
  quiz_type: 'mcq' | 'code' | 'mixed';
  test_type: 'instant' | 'booking' | 'timed';
  duration_minutes: number;
  passing_score: number;
  total_marks: number;
  platform_restriction: 'any' | 'mobile' | 'web';
  max_attempts: number;
  detect_window_switch: boolean;
  prevent_screenshot: boolean;
  detect_phone_call: boolean;
}
```

### Questions Response
```typescript
{
  questions: [
    {
      id: number;
      question_text: string;
      question_type: 'mcq' | 'code';
      options: string; // JSON array as string
      points: number;
    }
  ]
}
```

### Attempt Response
```typescript
{
  attempt: {
    id: number;
    test_id: number;
    user_id: number;
    status: 'in_progress' | 'completed';
    started_at: string;
  }
}
```

### Result Response
```typescript
{
  score: number;
  total_marks: number;
  status: 'passed' | 'failed';
  total_violations: number;
  window_switches: number;
  screenshot_attempts: number;
  phone_calls: number;
}
```

---

## ✨ Features Summary

### ✅ Fully Integrated
- Load test data from backend
- Create test attempts
- Submit answers to backend
- Record violations in real-time
- Get final scores and results
- All anti-cheating features working

### ✅ Error Handling
- Network errors caught and displayed
- Missing testId handled
- Invalid test data handled
- Failed API calls logged

### ✅ User Experience
- Loading states while fetching
- Error messages for failures
- Real-time violation warnings
- Smooth navigation
- Responsive UI

---

## 🚀 How to Use

### 1. Navigate to Quiz
```typescript
// From any page
import { useRouter } from 'expo-router';

const router = useRouter();
router.push(`/take-quiz?testId=123`);
```

### 2. Student Takes Quiz
- Views test information
- Clicks "Start Quiz"
- Answers questions
- Submits or auto-submits on timer end

### 3. Teacher/Admin Views Results
- Can see violation count in results
- Can view detailed violations via API:
```typescript
const violations = await violationAPI.getAttemptViolations(attemptId);
```

---

## 🎓 Testing Checklist

### Test Data Loading
- [x] Test loads from backend
- [x] Questions display correctly
- [x] Timer uses backend duration
- [x] Test info shows all fields

### Test Taking
- [x] Attempt created on start
- [x] Answers can be selected
- [x] Navigation between questions works
- [x] Submit sends all answers

### Violation Tracking
- [x] Window switches recorded (web)
- [x] Screenshot attempts recorded (mobile)
- [x] Phone calls recorded (mobile)
- [x] Violations saved to database
- [x] Violation counts updated

### Edge Cases
- [x] Missing testId handled
- [x] Network errors handled
- [x] No questions handled
- [x] Timer expiry handled

---

## 📝 Next Steps (Optional Enhancements)

1. **Real-time Violation Alerts**
   - Show teacher live violations
   - Send push notifications

2. **Violation Dashboard**
   - Create admin page to view all violations
   - Charts and statistics

3. **Automatic Disqualification**
   - Auto-fail after X violations
   - Configurable thresholds

4. **Video Proctoring**
   - Add camera monitoring
   - Record video during test

5. **AI Proctoring**
   - Face detection
   - Eye tracking
   - Multiple person detection

---

## 🎉 Success!

The take-quiz page is now **fully integrated** with the backend! All anti-cheating features are recording violations to the database in real-time. Students can take tests, and all their activities are monitored and logged.

Teachers/admins can view:
- Test attempts
- Scores and results
- Detailed violation logs
- Violation statistics

Everything is working end-to-end! 🚀
