# 🗑️ Delete Test Feature - Quick Guide

## Overview
Admins can now permanently delete tests from the system with a single click.

## Features ✅
- ✅ **Admin-only access** - Only admins see the delete button
- ✅ **Safety confirmation** - Two-step confirmation to prevent accidents
- ✅ **Cascading deletion** - Removes all associated data automatically
- ✅ **Loading state** - Visual feedback during deletion
- ✅ **Auto-redirect** - Returns to tests list after successful deletion
- ✅ **Error handling** - Proper error messages if deletion fails

## Location
**Test Details Page** → Delete button (🗑️ trash icon) in header

## How It Works

### Step 1: Access
- Navigate to any test details page
- Admin users will see a red trash icon button in the header
- Button is next to the "Edit" and "View Questions" buttons

### Step 2: Confirm
- Click the trash icon
- Confirmation dialog appears with warning message
- Dialog shows what will be deleted:
  - The test itself
  - All questions in the test
  - All materials linked to the test
  - All student attempts and scores

### Step 3: Delete
- Click "Delete" to confirm (or "Cancel" to abort)
- Loading spinner appears on the button
- API processes the deletion
- Success message shown
- Automatically redirects back to tests list

## What Gets Deleted
When you delete a test, the following data is **permanently removed**:

1. **Test Record** - The test itself with all metadata
2. **Questions** - All MCQ, Coding, and Theory questions
3. **Materials** - All linked study materials (videos, PDFs, etc.)
4. **Student Attempts** - All attempt records and scores
5. **Bookings** - Any scheduled test sessions

⚠️ **Warning:** This action **CANNOT be undone**. All data is permanently lost.

## User Interface

### Admin View (Header)
```
┌────────────────────────────────────────────────┐
│ ← Back to Tests                                │
│                                                │
│ Chapter 1 Test    [✏️ Edit] [📋 Questions] [🗑️] │
│ Materials and booking for this test            │
└────────────────────────────────────────────────┘
```

### Confirmation Dialog
```
┌─────────────────────────────────────────┐
│ Delete Test                         × │
├─────────────────────────────────────────┤
│                                         │
│ Are you sure you want to delete this    │
│ test? This will also delete all         │
│ associated questions, materials, and     │
│ student attempts. This action cannot    │
│ be undone.                              │
│                                         │
├─────────────────────────────────────────┤
│ [Cancel]  [🗑️ Delete]                  │
└─────────────────────────────────────────┘
```

### Delete Button States

#### Normal (Idle)
```typescript
<Pressable className="bg-red-50 border border-red-200">
  <Trash2 size={20} color="#ef4444" />
</Pressable>
```

#### Loading (Deleting)
```typescript
<Pressable className="bg-gray-300">
  <ActivityIndicator color="#ef4444" />
</Pressable>
```

#### Dark Mode
```typescript
<Pressable className="bg-red-900/30 border border-red-700">
  <Trash2 size={20} color="#ef4444" />
</Pressable>
```

## Code Changes

### File: `test-details.tsx`

**Added Import:**
```typescript
import { Trash2 } from 'lucide-react-native';
```

**Added State:**
```typescript
const [deletingTest, setDeletingTest] = useState(false);
const isAdmin = user?.role === 'admin';
```

**Added Handler:**
```typescript
const handleDeleteTest = () => {
  showAlert(
    'Delete Test',
    'Are you sure you want to delete this test? This will also delete all associated questions, materials, and student attempts. This action cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeletingTest(true);
            await testAPI.delete(Number(id));
            showAlert('Success', 'Test deleted successfully!', [
              { text: 'OK', onPress: () => router.back() }
            ]);
          } catch (error: any) {
            showAlert('Error', error.response?.data?.error || 'Failed to delete test');
          } finally {
            setDeletingTest(false);
          }
        }
      }
    ]
  );
};
```

**Added Button:**
```typescript
{isAdmin && (
  <Pressable
    onPress={handleDeleteTest}
    disabled={deletingTest}
    className={`p-3 rounded-lg ${
      deletingTest
        ? isDark ? 'bg-gray-700' : 'bg-gray-300'
        : isDark ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'
    }`}
  >
    {deletingTest ? (
      <ActivityIndicator size="small" color="#ef4444" />
    ) : (
      <Trash2 size={20} color="#ef4444" />
    )}
  </Pressable>
)}
```

## API Integration

**Endpoint:** `DELETE /api/tests/:id`

**Request:**
```typescript
await testAPI.delete(Number(id));
```

**Response (Success):**
```json
{
  "message": "Test deleted successfully"
}
```

**Response (Error):**
```json
{
  "error": "Failed to delete test"
}
```

## Permissions

### Who Can Delete?
- ✅ **Admins** - Full delete access
- ❌ **Teachers** - Cannot delete tests
- ❌ **Students** - Cannot see delete button

### Backend Authorization
```javascript
// backend/src/routes/tests.js
router.delete('/:id', auth, checkRole('admin'), testController.deleteTest);
```

## Safety Features

### 1. Two-Step Confirmation
- First click shows confirmation dialog
- Must click "Delete" again to confirm
- Can click "Cancel" to abort

### 2. Clear Warning Message
- Explains what will be deleted
- Warns about permanent data loss
- Uses destructive styling (red color)

### 3. Loading State
- Button disabled during deletion
- Shows loading spinner
- Prevents multiple delete attempts

### 4. Error Handling
- Catches API errors
- Shows user-friendly error messages
- Keeps user on page if deletion fails

### 5. Success Redirect
- Shows success message
- Automatically redirects to tests list
- Prevents viewing deleted test

## Testing Checklist

- [ ] Delete button visible for admins only
- [ ] Delete button hidden for teachers
- [ ] Delete button hidden for students
- [ ] Click shows confirmation dialog
- [ ] Cancel button closes dialog without deleting
- [ ] Delete button triggers deletion
- [ ] Loading spinner shows during deletion
- [ ] Success message appears after deletion
- [ ] Redirects to tests list after success
- [ ] Error message shows if deletion fails
- [ ] Button disabled during deletion
- [ ] Works in light mode
- [ ] Works in dark mode
- [ ] Works on web
- [ ] Works on iOS
- [ ] Works on Android

## Use Cases

### Use Case 1: Remove Duplicate Test
```
Admin creates duplicate test by mistake
   ↓
Opens test details page
   ↓
Clicks delete button
   ↓
Confirms deletion
   ↓
Test removed from system
```

### Use Case 2: Remove Outdated Test
```
Old semester test no longer needed
   ↓
Admin decides to clean up database
   ↓
Opens test details
   ↓
Deletes test with all old student data
   ↓
Database cleaned
```

### Use Case 3: Accidental Click Prevention
```
Admin accidentally clicks delete button
   ↓
Confirmation dialog appears
   ↓
Reads warning message
   ↓
Clicks "Cancel" instead of "Delete"
   ↓
Test remains untouched
```

## Benefits

### For Admins:
- ✅ **Easy cleanup** - Remove unnecessary tests
- ✅ **Database maintenance** - Keep system clean
- ✅ **Mistake correction** - Delete duplicates/errors
- ✅ **Safe operation** - Two-step confirmation prevents accidents

### For System:
- ✅ **Data integrity** - Cascading deletion ensures no orphaned records
- ✅ **Storage optimization** - Remove unused data
- ✅ **Clean database** - No test references without actual tests

### For Users:
- ✅ **Accurate test lists** - Only active tests shown
- ✅ **No confusion** - Outdated tests removed
- ✅ **Better organization** - Clean, relevant test catalog

## Important Notes

1. **Permanent Action** - Deleted tests cannot be recovered
2. **Admin Only** - Teachers cannot delete tests (prevents accidental data loss)
3. **Cascading Delete** - Backend handles deletion of related records
4. **No Undo** - Make sure before confirming deletion
5. **Backup Recommended** - Consider database backup before bulk deletions

## Related Features

- **Edit Test Title** - For updating test names instead of deleting
- **Delete Question** - For removing individual questions
- **View Questions** - To review test content before deleting

---

**Status**: ✅ Implemented & Ready
**Permission**: Admin Only
**Safety**: Two-step confirmation with warning
**Impact**: Permanent deletion of test and all associated data
