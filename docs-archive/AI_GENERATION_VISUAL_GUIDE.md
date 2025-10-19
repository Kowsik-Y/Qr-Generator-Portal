# AI Question Generation - Visual Guide

## 📱 User Interface Flow

### 1. View Questions Page - Header
```
┌─────────────────────────────────────────────────────────────┐
│  ← Questions                        [AI Generate] [+ Add]   │
│    Test: JavaScript Basics                                  │
└─────────────────────────────────────────────────────────────┘
     ↑                                      ↑
     Back                                   New AI Button!
```

**New Feature**: Purple "AI Generate" button next to the existing "Add" button

---

### 2. AI Generation Modal - Step 1: Configuration

```
╔═══════════════════════════════════════════════════════════╗
║  🪄 AI Question Generator                           [X]   ║
║  Generate questions using AI based on your prompt         ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Topic / Prompt                                           ║
║  ┌─────────────────────────────────────────────────────┐  ║
║  │ E.g., JavaScript arrays and methods,               │  ║
║  │ Python loops, Data structures...                   │  ║
║  │                                                     │  ║
║  └─────────────────────────────────────────────────────┘  ║
║                                                           ║
║  Question Type                                            ║
║  ┌──────┐  ┌─────────┐  ┌─────────┐                      ║
║  │ MCQ  │  │ THEORY  │  │ CODING  │                      ║
║  └──────┘  └─────────┘  └─────────┘                      ║
║     ↑                                                      ║
║   Selected (purple)                                       ║
║                                                           ║
║  Number of Questions                                      ║
║  ┌─────────────────────────────────────────────────────┐  ║
║  │ 5                                                   │  ║
║  └─────────────────────────────────────────────────────┘  ║
║                                                           ║
║  ┌──────────────────────────────────────────────────────┐ ║
║  │        ✨ Generate Questions                         │ ║
║  └──────────────────────────────────────────────────────┘ ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

**User Actions**:
1. Enter topic or prompt
2. Select question type (MCQ/Theory/Coding)
3. Enter number of questions
4. Click "Generate Questions"

---

### 3. Generating State

```
╔═══════════════════════════════════════════════════════════╗
║  🪄 AI Question Generator                           [X]   ║
║  Generate questions using AI based on your prompt         ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║                         ⌛                                 ║
║                      [Loading]                            ║
║              AI is generating your questions...           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

**Loading State**:
- Spinner animation
- "Generating..." text
- Button disabled during generation

---

### 4. AI Generation Modal - Step 2: Preview & Select

```
╔═══════════════════════════════════════════════════════════╗
║  🪄 AI Question Generator                           [X]   ║
║  Generate questions using AI based on your prompt         ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐  ║
║  │ ✨ 5 questions generated! Select ones you want to   │  ║
║  │    add.                                             │  ║
║  └─────────────────────────────────────────────────────┘  ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐  ║
║  │ [1] [MCQ] [10 pts]                            ☑️   │  ║
║  │                                                     │  ║
║  │ What does the array.map() method do?                │  ║
║  │                                                     │  ║
║  │ A. Delete elements from array                       │  ║
║  │ B. Transform elements (creates new array) ✓         │  ║
║  │ C. Sort the array in place                          │  ║
║  │ D. Find specific elements                           │  ║
║  └─────────────────────────────────────────────────────┘  ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐  ║
║  │ [2] [MCQ] [10 pts]                            ☑️   │  ║
║  │                                                     │  ║
║  │ Which method adds elements to the end of an array?  │  ║
║  │                                                     │  ║
║  │ A. shift()                                          │  ║
║  │ B. unshift()                                        │  ║
║  │ C. push() ✓                                         │  ║
║  │ D. pop()                                            │  ║
║  └─────────────────────────────────────────────────────┘  ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐  ║
║  │ [3] [THEORY] [10 pts]                         ☐    │  ║
║  │                                                     │  ║
║  │ Explain the difference between map() and forEach()  │  ║
║  │                                                     │  ║
║  │ Answer: map() returns a new array with transformed │  ║
║  │ elements, while forEach() just iterates...          │  ║
║  └─────────────────────────────────────────────────────┘  ║
║                                                           ║
║  [  Generate New  ]    [  Add 2 Selected  ]              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

**Features**:
- ✅ Checkboxes to select/deselect questions
- 📋 Full question preview
- 🎯 Correct answers highlighted (green)
- 🏷️ Type and points badges
- 🔄 "Generate New" to start over
- ➕ "Add X Selected" to add chosen questions

---

### 5. After Adding - Success

```
╔═══════════════════════════════════════════════════════════╗
║                     Success! ✓                            ║
║                                                           ║
║           Added 2 questions successfully!                 ║
║                                                           ║
║                      [  OK  ]                             ║
╚═══════════════════════════════════════════════════════════╝
```

Then returns to the questions list with newly added questions.

---

## 🎨 Visual Elements

### Color Coding

#### Question Type Badges
- **MCQ**: Blue badge (`bg-blue-100`, `text-blue-700`)
- **THEORY**: Purple badge (`bg-purple-100`, `text-purple-700`)
- **CODING**: Green badge (`bg-green-100`, `text-green-700`)

#### Points Badge
- Yellow badge (`bg-yellow-100`, `text-yellow-700`)

#### Correct Answers
- Green background for MCQ correct options
- Green text for answers

#### Selection State
- **Selected**: Purple border (`border-purple-500`)
- **Unselected**: Gray border (`border-gray-300`)

#### Buttons
- **AI Generate**: Purple (`bg-purple-500`)
- **Add**: Blue (`bg-blue-500`)
- **Generate New**: Gray (`bg-gray-800`)
- **Add Selected**: Purple (`bg-purple-500`)

---

## 📊 Complete User Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              Teacher Opens View Questions Page              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │ Click "AI Generate"    │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │   Modal Opens          │
              │   (Configuration)      │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │ Enter Prompt           │
              │ Select Type            │
              │ Enter Count            │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │ Click "Generate"       │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │ Loading State          │
              │ (API Call to Gemini)   │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │ Questions Generated    │
              │ (Preview Mode)         │
              └────────────┬───────────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
           ▼                               ▼
  ┌─────────────────┐          ┌─────────────────┐
  │ Generate New?   │          │ Select Questions│
  └─────────┬───────┘          └────────┬────────┘
            │                           │
            │                           ▼
            │              ┌─────────────────────┐
            │              │ Click "Add Selected"│
            │              └────────┬────────────┘
            │                       │
            └───────────┬───────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │ Questions Added     │
              │ to Database         │
              └─────────┬───────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │ Success Message     │
              │ Modal Closes        │
              └─────────┬───────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │ Questions List      │
              │ Refreshed          │
              └─────────────────────┘
```

---

## 💡 Interactive Elements

### Clickable Areas

1. **AI Generate Button**: Opens modal
2. **Question Type Buttons**: Switch between MCQ/Theory/Coding
3. **Generate Questions Button**: Triggers API call
4. **Question Cards**: Toggle selection
5. **Checkbox**: Toggle selection
6. **Generate New Button**: Reset to configuration
7. **Add Selected Button**: Add to database
8. **Close Button (X)**: Close modal

### States

#### Button States
```
Normal:     [  Generate Questions  ]
Hover:      [  Generate Questions  ] (lighter shade)
Disabled:   [  Generate Questions  ] (gray)
Loading:    [  Generating...  ] (with spinner)
```

#### Question Card States
```
Selected:   Purple border + Checkmark
Unselected: Gray border + Empty checkbox
Hover:      Slight scale animation
```

---

## 📱 Responsive Design

### Mobile View (< 768px)
- Full-screen modal
- Vertical layout
- Touch-friendly buttons
- Bottom sheet animation

### Tablet/Desktop View (≥ 768px)
- Centered modal with max-width
- Same features as mobile
- Better spacing
- Sidebar visible

---

## 🎯 Key UI Features

### 1. **Visual Feedback**
- Loading spinners during generation
- Success/error alerts
- Button state changes
- Selection highlights

### 2. **Clear Information Hierarchy**
- Question number badges
- Type indicators
- Points display
- Correct answer highlighting

### 3. **Easy Selection**
- Large tap targets
- Visual checkboxes
- Entire card clickable
- Clear selected state

### 4. **Intuitive Navigation**
- Clear back button
- Close button in modal
- Generate New option
- Seamless flow

---

## 🎨 Dark Mode Support

All components support dark mode:
- Dark backgrounds
- Adjusted text colors
- Proper contrast ratios
- Consistent theming

```
Light Mode:
- Background: white/gray-50
- Text: gray-900/gray-700
- Borders: gray-200/gray-300

Dark Mode:
- Background: gray-900/gray-800
- Text: white/gray-200
- Borders: gray-700/gray-600
```

---

## ✨ Animations

1. **Modal Entry**: Slide up from bottom
2. **Loading**: Rotating spinner
3. **Button Hover**: Subtle scale effect
4. **Selection**: Smooth checkbox animation
5. **Alert**: Fade in/out

---

This visual guide shows the complete UI flow of the AI question generation feature!
