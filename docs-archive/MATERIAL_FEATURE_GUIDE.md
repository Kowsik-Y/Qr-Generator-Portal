# 🎯 Quick Guide: Test Materials Feature

## ✅ All Issues Fixed!

### Problem Solved
- ❌ **Before**: "column created_by of relation tests does not exist"
- ✅ **After**: Database schema updated, test materials feature working

## 🚀 How to Test

### 1. Start Backend Server
```bash
cd backend
npm start
```

### 2. Start Native App
```bash
cd native
npx expo start
```

### 3. Test the Flow

#### Create a Test
1. Login as teacher/admin
2. Go to Courses → Select a Course
3. Click "Create New Test" button
4. Fill in test details:
   - Title: "Midterm Exam"
   - Quiz Type: "mcq" or "mixed"
   - Test Type: "timed"
   - Duration: 60 minutes
5. Click Create

#### Add Materials to Test
1. From course details, click on the test card
2. In test details page, click "Add Materials to Test"
3. Fill in material details:
   - **Title**: "Chapter 1 Notes"
   - **Material Type**: Choose from dropdown
   - **URL/Content**: Based on type selected
4. Click "Add Material"
5. Material should appear in test details page

### 4. Test Different Material Types

#### Document/PDF
- Type: Document or PDF
- File URL: `https://example.com/notes.pdf`

#### Video
- Type: Video  
- File URL: `https://youtube.com/watch?v=example`

#### Link
- Type: Link
- URL: `https://example.com` (required)

#### Code Snippet
- Type: Code
- Content: Paste code directly (required)

## 📡 API Testing (Postman/curl)

### Get Test Materials
```bash
GET http://localhost:5000/api/materials/test/1
```

### Create Test Material
```bash
POST http://localhost:5000/api/materials
Content-Type: application/json

{
  "test_id": 1,
  "title": "Study Guide",
  "description": "Complete study guide for midterm",
  "material_type": "pdf",
  "file_url": "https://example.com/guide.pdf"
}
```

### Create Test
```bash
POST http://localhost:5000/api/tests
Content-Type: application/json

{
  "course_id": 1,
  "title": "Midterm Assessment",
  "quiz_type": "mcq",
  "test_type": "timed",
  "duration_minutes": 60
}
```

## 🎨 UI Features

### Test Details Page Shows:
- ✅ Test information card
- ✅ Action buttons (Add Materials, Add Questions, Take Test)
- ✅ Materials section with cards
- ✅ Booking slot section
- ✅ Different icons for material types
- ✅ View/Download buttons

### Add Material Page Shows:
- ✅ Title input (required)
- ✅ Description textarea
- ✅ Material type dropdown
- ✅ Dynamic inputs based on type
- ✅ Validation messages
- ✅ Success/error alerts

## 🔐 Access Control

### Teachers & Admins Can:
- ✅ Create tests
- ✅ Add materials to tests
- ✅ Add questions to tests
- ✅ View all materials

### Students Can:
- ✅ View test details
- ✅ View/download materials
- ✅ Take tests
- ✅ Book test slots
- ❌ Cannot add materials
- ❌ Cannot add questions

## 🐛 Troubleshooting

### "Column created_by does not exist"
- **Solution**: Migration already applied ✅

### "Table test_materials does not exist"
- **Solution**: Migration already applied ✅

### Backend not picking up changes
```bash
# Restart backend server
cd backend
npm start
```

### Frontend not showing materials
```bash
# Clear Expo cache
cd native
npx expo start -c
```

### Database connection issues
```bash
# Check PostgreSQL is running
# Update backend/.env with correct credentials
```

## 📊 Database Schema

### Tests Table
```sql
tests (
  id, course_id, title, description,
  quiz_type, test_type, duration_minutes,
  start_time, end_time, passing_score,
  platform_restriction, allowed_browsers,
  created_by,  -- ✅ NEW COLUMN
  is_active, created_at, updated_at
)
```

### Test Materials Table
```sql
test_materials (
  id, test_id, title, description,
  material_type, file_url, file_size,
  content, order_number,
  uploaded_by,  -- Links to users
  is_active, created_at, updated_at
)
```

## 🎯 What's Working

- ✅ Database schema updated
- ✅ Backend API endpoints created
- ✅ Frontend API integration
- ✅ Add material page created
- ✅ Test details shows materials
- ✅ Material type icons and styling
- ✅ Access control implemented
- ✅ Form validation working
- ✅ Navigation flow complete

## 📝 What's Next

1. Test file upload with actual storage (AWS S3, etc.)
2. Create "Add Questions" page
3. Implement booking backend functionality
4. Add material preview modal
5. Add edit/delete material functionality
6. Add bulk material upload
7. Add material search/filter

## 🎉 Success Criteria

You know it's working when:
1. ✅ You can create a test without errors
2. ✅ "Add Materials to Test" button appears (teachers only)
3. ✅ Material form validates correctly
4. ✅ Materials appear in test details page
5. ✅ Different material types show different icons
6. ✅ Students can view but not add materials
