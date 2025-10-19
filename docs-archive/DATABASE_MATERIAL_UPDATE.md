# Database Schema Update & Add Material Feature

## ✅ Completed Changes

### 1. Database Schema Updates

#### Added `created_by` column to `tests` table
- **Column**: `created_by INTEGER REFERENCES users(id) ON DELETE SET NULL`
- **Purpose**: Track which user created the test
- **Migration**: Applied successfully via `add_test_materials.sql`

#### Created `test_materials` table
```sql
CREATE TABLE test_materials (
  id SERIAL PRIMARY KEY,
  test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  material_type VARCHAR(50) DEFAULT 'document',
  file_url VARCHAR(500),
  file_size BIGINT,
  content TEXT,
  order_number INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Material Types**: `document`, `video`, `link`, `pdf`, `code`, `other`

### 2. Backend Updates

#### Created `materialController.js`
- ✅ `getTestMaterials(testId)` - Get all materials for a test
- ✅ `getCourseMaterials(courseId)` - Get all materials for a course
- ✅ `createTestMaterial()` - Add material to test
- ✅ `updateTestMaterial(id)` - Update material
- ✅ `deleteTestMaterial(id)` - Delete material

#### Updated `routes/materials.js`
- ✅ Added route: `GET /materials/test/:test_id`
- ✅ Updated route: `POST /materials` (supports both `test_id` and `course_id`)
- ✅ Includes `uploaded_by_name` in test materials response

#### Fixed `testController.js`
- ✅ Fixed `created_by` to handle cases where `req.user` is null/undefined
- ✅ Safely defaults to `null` if no authenticated user

### 3. Frontend Updates

#### Updated `lib/api.ts`
```typescript
export const materialAPI = {
  getByCourse: (courseId: number) => api.get(`/materials/course/${courseId}`),
  getByTest: (testId: number) => api.get(`/materials/test/${testId}`), // ✅ NEW
  create: (data: CreateMaterialRequest) => api.post('/materials', data),
  // ... other methods
};
```

#### Updated `lib/types.ts`
```typescript
export interface CreateMaterialRequest {
  course_id?: number;  // ✅ Now optional
  test_id?: number;    // ✅ NEW
  title: string;
  material_type?: 'document' | 'video' | 'link' | 'pdf' | 'code' | 'other';
  file_url?: string;
  file_size?: number;  // ✅ NEW
  content?: string;
  order_number?: number;
}
```

#### Updated `app/(tabs)/test-details.tsx`
- ✅ Changed from `materialAPI.getByCourse()` to `materialAPI.getByTest()`
- ✅ Updated response handling to use `.data.materials`
- ✅ Already passes `testId` parameter to add-material page

#### Created `app/add-material-to-test.tsx`
**Features**:
- ✅ Material type selector (Document, PDF, Video, Link, Code, Other)
- ✅ Title & description inputs
- ✅ URL input (for links, videos, documents)
- ✅ Code content input (for code snippets)
- ✅ Validation for required fields
- ✅ Success/error handling with alerts
- ✅ Access control (teachers & admins only)
- ✅ Navigates back to test details on success

## 📋 API Endpoints

### Test Materials
- `GET /api/materials/test/:testId` - Get all materials for a test
- `POST /api/materials` - Create material (with `test_id` in body)
- `PUT /api/materials/:id` - Update material
- `DELETE /api/materials/:id` - Delete material

### Course Materials
- `GET /api/materials/course/:courseId` - Get all materials for a course
- `POST /api/materials` - Create material (with `course_id` in body)

## 🔄 Navigation Flow

```
Courses Page
    ↓
Course Details Page (list of tests)
    ↓
Test Details Page (materials, booking, actions)
    ↓
Add Material to Test Page
    ↓ (on success)
Test Details Page (updated with new material)
```

## 🎯 How to Use

### For Teachers/Admins:
1. Navigate to Test Details page
2. Click "Add Materials to Test" button
3. Fill in:
   - Title (required)
   - Description (optional)
   - Material Type (dropdown)
   - URL or Code content (based on type)
4. Click "Add Material"
5. Material appears in test details

### For Students:
- View all materials on Test Details page
- Download/view materials
- See material type icons and metadata

## ✅ Testing Checklist

- [x] Database migration runs successfully
- [ ] Create test works (with created_by column)
- [ ] Add material to test works
- [ ] Test materials appear in test details
- [ ] Different material types display correctly
- [ ] Access control works (students can't add materials)
- [ ] URL validation works for link type
- [ ] Code content displays properly
- [ ] Delete/update materials works

## 🐛 Fixes Applied

1. **"column created_by does not exist"** - Added column to tests table
2. **Missing test_materials table** - Created with proper schema
3. **testController using req.user.id without check** - Added null safety
4. **materialAPI missing getByTest()** - Added method
5. **CreateMaterialRequest missing test_id** - Updated interface
6. **test-details using wrong API** - Updated to use getByTest()

## 📁 Files Modified

### Backend
- `backend/database/schema_enhanced.sql` - Schema updates
- `backend/database/migrations/add_test_materials.sql` - Migration file
- `backend/src/controllers/materialController.js` - Created
- `backend/src/controllers/testController.js` - Fixed created_by
- `backend/src/routes/materials.js` - Added test materials routes

### Frontend
- `native/lib/api.ts` - Added getByTest()
- `native/lib/types.ts` - Updated CreateMaterialRequest
- `native/app/(tabs)/test-details.tsx` - Use getByTest()
- `native/app/add-material-to-test.tsx` - Created

## 🚀 Next Steps

1. Test creating a test
2. Test adding materials to test
3. Verify materials display correctly
4. Implement file upload for actual file storage (optional)
5. Add material preview/download functionality
6. Create "Add Questions" page
7. Implement booking functionality backend
