# Quick Reference: Take Quiz Integration

## 🚀 How to Navigate to Take Quiz Page

```typescript
// Method 1: From test details page
router.push(`/take-quiz?testId=${test.id}`);

// Method 2: From test list
<Pressable onPress={() => router.push(`/take-quiz?testId=${item.id}`)}>
  <Text>Take Quiz</Text>
</Pressable>
```

## 📊 Violation Types Reference

| Code | Description | Severity | Platform |
|------|-------------|----------|----------|
| `window_switch` | User switched window/tab | Medium | Web + Mobile |
| `screenshot_attempt` | Tried to take screenshot | High | Mobile |
| `phone_call` | Active call during test | High | Mobile |
| `copy_paste` | Tried to copy/paste | Low | All |
| `tab_switch` | Browser tab switch | Medium | Web |
| `other` | Other violations | Medium | All |

## 🔑 Key Functions

### Load Test
```typescript
const test = await testAPI.getTestById(testId);
const questions = await testAPI.getTestQuestions(testId);
```

### Start Attempt
```typescript
const attempt = await attemptAPI.startAttempt({ test_id: testId });
```

### Submit Answer
```typescript
await attemptAPI.submitAnswer({
  attempt_id: attemptId,
  question_id: questionId,
  answer: selectedAnswer
});
```

### Record Violation
```typescript
await violationAPI.recordViolation({
  attempt_id: attemptId,
  test_id: testId,
  violation_type: 'window_switch',
  details: { timestamp, message, platform },
  severity: 'medium'
});
```

### Get Result
```typescript
const result = await attemptAPI.getAttemptResult(attemptId);
// Returns: { score, total_marks, status, total_violations, ... }
```

## 🎯 Usage Example

```typescript
// 1. User clicks test from list
<Pressable onPress={() => router.push(`/take-quiz?testId=5`)}>
  <Text>Take JavaScript Quiz</Text>
</Pressable>

// 2. Quiz page loads
//    - Fetches test data
//    - Shows test info
//    - User clicks "Start Quiz"

// 3. Creates attempt automatically
// 4. User answers questions
// 5. Violations recorded automatically
// 6. User submits → answers sent to backend
// 7. Shows final score and violations count

// 8. Teacher can view violations
const violations = await violationAPI.getAttemptViolations(attemptId);
```

## ✅ Integration Status

✅ Backend API fully integrated
✅ Violation tracking working
✅ Test attempts created and tracked
✅ Answers submitted to database
✅ Scores calculated by backend
✅ All platforms supported (Web, iOS, Android)

## 🛠️ Troubleshooting

**Problem:** Test not loading
- Check if testId is passed in URL
- Verify backend is running on port 5000
- Check network connection

**Problem:** Violations not recording
- Ensure attemptId is set
- Check backend /api/violations endpoints
- Look at console for error logs

**Problem:** Answers not submitting
- Verify attempt was created
- Check question IDs match backend
- Ensure user is authenticated

## 📱 Platform-Specific Features

**Web Only:**
- Fullscreen enforcement
- Right-click prevention
- Keyboard shortcut blocking

**Mobile Only:**
- Screenshot prevention (native)
- Phone call detection
- App backgrounding detection

**All Platforms:**
- Window/tab switching detection
- Timer countdown
- Answer submission
- Violation recording

---

Everything is working! Just pass `testId` as a URL parameter and the page handles the rest! 🎉
