# Test Details Page Implementation

## Overview
Created a new **Test Details Page** that shows materials and booking slots for a specific test.

## File Created
- `native/app/test-details.tsx` - New page for individual test details

## Navigation Flow

### From Course Details Page:
```
Course Details → Click Test Card → Test Details Page
```

### From Tests Page:
```
Tests Page → Click Test Card → Test Details Page
```

## Test Details Page Features

### 1. **Test Information Card**
- Shows test metadata: type, duration, marks
- Different views for Teachers vs Students:
  - **Teachers/Admins see:**
    - ➕ Add Materials to Test button
    - ✏️ Add Questions button
  - **Students see:**
    - ▶️ Take Test button

### 2. **Test Materials Section**
- Displays all materials specific to this test
- Material cards show:
  - Material type (Video, PDF, Code, etc.)
  - Title and description
  - View/Watch button
  - Download button
- Teachers can add materials via "+" button
- Empty state for no materials

### 3. **Book Test Slot Section**
- Single booking card with:
  - Test date and instructor
  - Time slot dropdown (multiple options)
  - Available seats indicator (green/orange/red)
  - **"Book It" button** to confirm booking
- Booking confirmation alert on success

## Page Structure

```
┌────────────────────────────────────────┐
│ ← Back to Tests                        │
│ Test Title                              │
│ Test Description                        │
├────────────────────────────────────────┤
│ ┌──────────────────────────────────┐   │
│ │ Test Info Card                   │   │
│ │ [MIXED] [Instant] [30min] [100]  │   │
│ │                                  │   │
│ │ For Teachers/Admins:             │   │
│ │ [➕ Add Materials to Test]       │   │
│ │ [✏️ Add Questions]                │   │
│ │                                  │   │
│ │ For Students:                    │   │
│ │ [▶️ Take Test]                    │   │
│ └──────────────────────────────────┘   │
├────────────────────────────────────────┤
│ Test Materials          [+ Add]        │
│ ┌──────────┐ ┌──────────┐             │
│ │PDF       │ │Video     │             │
│ │Material 1│ │Material 2│             │
│ │[View]    │ │[Watch]   │             │
│ │[Download]│ │[Download]│             │
│ └──────────┘ └──────────┘             │
├────────────────────────────────────────┤
│ Book Test Slot                         │
│ ┌──────────────────────────────────┐   │
│ │ Test Session                     │   │
│ │ 👤 Test Instructor               │   │
│ │ 📅 Oct 20, 2025                  │   │
│ │                                  │   │
│ │ Select Time Slot                 │   │
│ │ [10:00 AM - 11:00 AM ▼]         │   │
│ │                                  │   │
│ │ Available Seats    [12/30]      │   │
│ │                                  │   │
│ │      [     Book It     ]        │   │
│ └──────────────────────────────────┘   │
└────────────────────────────────────────┘
```

## Teacher/Admin Actions

### Add Materials to Test
- Click "Add Materials to Test" button
- Navigates to: `/add-material-to-test?testId={id}&testName={title}`
- **TODO:** Create this page to upload/attach materials

### Add Questions
- Click "Add Questions" button
- Navigates to: `/add-questions?testId={id}&testName={title}`
- **TODO:** Create this page to add/edit test questions

## Student Actions

### Take Test
- Click "Take Test" button
- Navigates to: `/take-quiz?testId={id}`
- Opens the quiz interface

### Book Slot
- Select time from dropdown
- Click "Book It" button
- Shows confirmation alert
- **TODO:** Implement actual booking API call

## API Integration

### Current APIs Used:
- `testAPI.getById(testId)` - Fetch test details
- `materialAPI.getByCourse(courseId)` - Fetch materials (temporary)

### APIs Needed:
- `materialAPI.getByTest(testId)` - Fetch test-specific materials
- `bookingAPI.create()` - Create booking for test slot
- `materialAPI.addToTest()` - Attach materials to test
- `questionAPI.create()` - Add questions to test

## Next Steps

### 1. Create Add Materials Page (`/add-material-to-test`)
- Upload material files
- Link existing materials to test
- Set material type and description

### 2. Create Add Questions Page (`/add-questions`)
- Add MCQ/True-False/Coding questions
- Set question marks and difficulty
- Preview question format

### 3. Implement Booking API
- Connect "Book It" button to backend
- Save booking to database
- Send confirmation to user

### 4. Update Material API
- Add `getByTest()` method
- Add `addToTest()` method
- Support test-material relationships

## Benefits

✅ **Separation of Concerns** - Each test has its own dedicated page  
✅ **Teacher Controls** - Easy access to add materials and questions  
✅ **Student Focus** - Clear path to study materials and take test  
✅ **Booking Integration** - Slot booking right where students need it  
✅ **Scalable** - Can add more test-specific features later  

## Testing Checklist

- [ ] Test card navigation works from course details
- [ ] Test card navigation works from tests page
- [ ] Teacher sees "Add Materials" and "Add Questions" buttons
- [ ] Student sees "Take Test" button
- [ ] Materials display correctly
- [ ] Booking slot dropdown works
- [ ] "Book It" button shows confirmation
- [ ] Empty states display when no materials
- [ ] Dark/light theme works correctly
- [ ] Responsive layout on web/mobile
