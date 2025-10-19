# Quiz Portal Backend

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup PostgreSQL Database
```bash
# Create database
createdb quiz_portal

# Run migrations
psql -d quiz_portal -f database/schema.sql
```

### 3. Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your database credentials
```

### 4. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (teacher/admin)
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Tests
- `GET /api/courses/:courseId/tests` - Get tests for course
- `POST /api/courses/:courseId/tests` - Create test
- `GET /api/tests/:id` - Get test details
- `PUT /api/tests/:id` - Update test
- `DELETE /api/tests/:id` - Delete test

### Questions
- `GET /api/tests/:testId/questions` - Get questions
- `POST /api/tests/:testId/questions` - Add question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

### Test Attempts
- `POST /api/tests/:testId/start` - Start test attempt
- `POST /api/attempts/:attemptId/answer` - Submit answer
- `POST /api/attempts/:attemptId/submit` - Submit test
- `GET /api/attempts/:attemptId/review` - Review results

### Code Execution
- `POST /api/code/execute` - Execute code
- `POST /api/code/test` - Run code with test cases

## Tech Stack
- Node.js + Express
- PostgreSQL
- JWT Authentication
- VM2 (Code Execution)
