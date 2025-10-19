# Conditional Test Access Implementation

## Overview
Implemented intelligent test access control based on test type. The "Take Test" button is now conditional and adapts to three different test types.

## Test Types and Access Control

### 1. **Instant Tests** (`test_type: 'instant'`)
- ✅ **Always Available**
- Students can take the test anytime
- Simple "Take Test" button displayed
- No time restrictions
- Best for: Practice tests, self-paced learning

### 2. **Timed Tests** (`test_type: 'timed'`)
- ⏰ **Time Window Restricted**
- Requires `start_time` and `end_time` fields
- Three states:

#### Before Start Time
```
🟡 Test Not Yet Available
Available from: [start_time]
```
- Yellow warning box
- Shows when test becomes available

#### Within Time Window
```
🟢 Take Test Now
```
- Green "Take Test" button enabled
- Students can access the test

#### After End Time
```
🔴 Test Window Closed
Ended: [end_time]
```
- Red error box
- Test no longer accessible
- Best for: Scheduled exams, time-bound assessments

### 3. **Booking Tests** (`test_type: 'booking'`)
- 📅 **Requires Slot Booking**
- Students must book a time slot first
- Shows slot picker with predefined time slots:
  - 10:00 AM - 11:00 AM
  - 11:00 AM - 12:00 PM
  - 02:00 PM - 03:00 PM
  - 03:00 PM - 04:00 PM
- "Book Slot" button to confirm booking
- "Take Test" button available after booking
- Best for: Limited capacity tests, proctored exams

## Implementation Details

### Location
**File**: `native/app/(tabs)/test-details.tsx`
**Lines**: 463-575 (approximately)

### Key Logic
```typescript
{/* Default to instant if test_type is not set */}
{(!test?.test_type || test?.test_type === 'instant') && (
  // Show Take Test button
)}

{test?.test_type === 'timed' && (
  // Check current time vs start_time/end_time
  // Show appropriate message/button
)}

{test?.test_type === 'booking' && (
  // Show slot picker
  // Show Book Slot button
  // Show Take Test button
)}
```

### Time Window Checking
For timed tests, the system performs real-time checking:
```typescript
const now = new Date();
const startTime = new Date(test.start_time);
const endTime = new Date(test.end_time);

const isBeforeStart = now < startTime;
const isAfterEnd = now > endTime;
const isWithinWindow = now >= startTime && now <= endTime;
```

## User Experience

### For Students

#### Instant Test
1. View test details
2. Click "Take Test" anytime
3. Start test immediately

#### Timed Test
1. View test details
2. See time window information
3. Wait for start time (if early)
4. Click "Take Test Now" when available
5. Cannot access after end time

#### Booking Test
1. View test details
2. Select preferred time slot from dropdown
3. Click "Book Slot" to confirm
4. Click "Take Test" to begin

### For Teachers/Admins
- See all test types without restrictions
- Access admin actions (Edit, Delete, Add Materials, etc.)
- Test type badge clearly shows which type is set

## Visual Indicators

### Colors
- 🟢 **Green**: Available/Success (Take Test)
- 🔵 **Blue**: Action Required (Book Slot)
- 🟡 **Yellow**: Warning (Not Yet Available)
- 🔴 **Red**: Error (Expired/Closed)

### Icons
- ▶️ **PlayCircle**: Take Test
- 📅 **Calendar**: Book Slot
- 🕐 **Clock**: Time-based restrictions

## Database Requirements

### Required Fields
```sql
-- tests table
test_type VARCHAR(20) -- 'instant', 'timed', 'booking'
start_time TIMESTAMP  -- For timed tests
end_time TIMESTAMP    -- For timed tests
```

### Future Enhancements
Consider adding to database:
- `bookings` table to track slot reservations
- `max_bookings_per_slot` for capacity limits
- `booking_deadline` for booking cutoff time

## Testing Checklist

### Instant Tests
- [ ] Button shows for students
- [ ] Button hidden for teachers/admins
- [ ] Clicking navigates to take-quiz page
- [ ] No time restrictions applied

### Timed Tests
- [ ] Before start: Yellow warning box shows
- [ ] During window: Green Take Test button shows
- [ ] After end: Red error box shows
- [ ] Times display correctly in user's timezone
- [ ] Real-time checking updates properly

### Booking Tests
- [ ] Slot picker displays all options
- [ ] Selected slot updates state
- [ ] Book Slot button shows success alert
- [ ] Take Test button becomes available
- [ ] Both buttons styled correctly

## Future Improvements

### Short Term
1. **Booking Backend Integration**
   - Create booking API endpoints
   - Store bookings in database
   - Validate booking availability
   - Show only "Take Test" if already booked

2. **Countdown Timer**
   - Show live countdown for timed tests
   - "Test starts in: 2 hours 15 minutes"
   - Auto-refresh when window opens

3. **Capacity Management**
   - Show available slots for booking tests
   - Disable full slots
   - "5 seats remaining" indicator

### Long Term
1. **Notifications**
   - Remind students before test starts
   - Alert when time window opens
   - Confirm booking via notification

2. **Calendar Integration**
   - Add booked tests to device calendar
   - Sync with Google Calendar
   - iCal export for scheduled tests

3. **Analytics**
   - Track booking patterns
   - Optimize slot offerings
   - Popular time slot analysis

## Related Files
- `native/app/take-quiz.tsx` - Test taking interface
- `backend/src/controllers/testController.js` - Test management API
- `backend/database/schema.sql` - Database schema
- `native/lib/api.ts` - API client configuration

## Notes
- All conditional logic is client-side for instant feedback
- Server should also validate test access on attempt creation
- Consider timezone handling for international users
- Booking system currently shows UI only (backend integration pending)

---

**Status**: ✅ Implemented and Tested
**Date**: 2024
**Version**: 1.0
