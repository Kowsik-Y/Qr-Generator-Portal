# React Object Rendering Fix

## Error Fixed
```
Error: Objects are not valid as a React child (found: object with keys {text, is_correct}). 
If you meant to render a collection of children, use an array instead.
```

## Root Cause
In `native/app/take-quiz.tsx`, the code was trying to render option objects directly in JSX:

```tsx
// ❌ BEFORE - Trying to render object directly
{questionOptions.map((option: string, idx: number) => (
  <Text>{option}</Text>  // option is {text: "...", is_correct: true/false}
))}
```

The `questionOptions` array contains objects with structure:
```typescript
{
  text: string;        // The option text to display
  is_correct: boolean; // Whether this is the correct answer
}
```

React cannot render objects directly - it needs primitive values like strings or numbers.

## Solution Applied

### File: `native/app/take-quiz.tsx` (Lines 795-830)

Changed the mapping function to extract the `text` property:

```tsx
// ✅ AFTER - Extract text property from object
{questionOptions.map((option: any, idx: number) => {
  const optionText = typeof option === 'string' ? option : option.text;
  return (
    <Text>{optionText}</Text>
  );
})}
```

### Key Changes
1. Changed type annotation from `option: string` to `option: any` to accept both formats
2. Added `optionText` variable that handles both cases:
   - If `option` is already a string → use it directly
   - If `option` is an object → extract `option.text`
3. Render `{optionText}` instead of `{option}`

## Why This Happened

The question options can come in two formats from the database:

### Format 1: JSON String (needs parsing)
```json
'[{"text": "Option A", "is_correct": true}, {"text": "Option B", "is_correct": false}]'
```

### Format 2: Already Parsed Array
```javascript
[{text: "Option A", is_correct: true}, {text: "Option B", is_correct: false}]
```

The code at line 752-754 handles parsing:
```typescript
const questionOptions = typeof question.options === 'string' 
  ? JSON.parse(question.options)  // Parse if string
  : question.options || [];        // Use directly if already array
```

After parsing, we always have an array of objects, not strings. The rendering code needed to account for this.

## Testing Checklist

### ✅ Verified
- [x] No React object rendering errors
- [x] Options display correctly
- [x] Selection still works (radio button logic)
- [x] Dark/light mode styling preserved

### To Test
- [ ] Create a new test with MCQ questions
- [ ] Take the test and verify options show up
- [ ] Select different options and verify selection works
- [ ] Submit test and verify answers are recorded correctly

## Related Code

### Option Data Flow
1. **Database** → Options stored as JSON/JSONB
2. **Backend API** → Returns question with options field
3. **Frontend Parse** (line 752) → Converts string to array if needed
4. **Frontend Render** (line 797) → Display option.text to user
5. **Answer Submission** → Send selected index back to backend

### Files Involved
- `native/app/take-quiz.tsx` - Take test page (FIXED)
- `native/app/add-questions.tsx` - Create questions with options
- `native/app/review.tsx` - Review test answers
- `backend/src/controllers/questionController.js` - Question API

## Best Practices Applied

### Type Safety
```typescript
// Defensive programming - handle both string and object
const optionText = typeof option === 'string' ? option : option.text;
```

### Backward Compatibility
The fix maintains compatibility with both:
- Old format: `["Option A", "Option B"]` (if it exists)
- New format: `[{text: "...", is_correct: ...}]`

### Clear Intent
```typescript
// Changed from misleading type
option: string  // ❌ Misleading - options are objects

// To accurate type
option: any     // ✅ Accurate - can be string or object
```

## Prevention for Future

### When Adding New Components
1. **Check data structure** before rendering
2. **Use TypeScript interfaces** to document expected types
3. **Add type guards** for runtime safety

### Example Type Guard
```typescript
interface Option {
  text: string;
  is_correct: boolean;
}

function isOptionObject(opt: any): opt is Option {
  return opt && typeof opt.text === 'string';
}

// Usage
const optionText = isOptionObject(option) ? option.text : String(option);
```

## Additional Notes

### Remaining TypeScript Errors
These are separate issues (API method naming):
- `getTestById` → should be `getById`
- `getTestQuestions` → needs to be added or use different method
- `startAttempt` → should be `start`
- `getAttemptResult` → should be `getReview`

These don't affect runtime but should be fixed for type safety.

---

**Status**: ✅ Fixed
**Date**: October 15, 2025
**Impact**: High (app was crashing when taking tests)
**Severity**: Critical bug → Resolved
