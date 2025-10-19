const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const testRoutes = require('./routes/tests');
const questionRoutes = require('./routes/questions');
const attemptRoutes = require('./routes/attempts');
const codeRoutes = require('./routes/code');
const departmentRoutes = require('./routes/departmentRoutes');
const academicYearRoutes = require('./routes/academicYearRoutes');
const materialRoutes = require('./routes/materials');
const bookingRoutes = require('./routes/bookings');
const violationRoutes = require('./routes/violations');
const databaseRoutes = require('./routes/databaseRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const activityLogsRoutes = require('./routes/activityLogsRoutes');
const deviceRoutes = require('./routes/deviceRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests from multiple frontend URLs (for mobile and web)
    const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:8081').split(',');
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Quiz Portal API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/academic-years', academicYearRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/violations', violationRoutes);
app.use('/api/admin/database', databaseRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/admin/logs', activityLogsRoutes);
app.use('/api/devices', deviceRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║      Quiz Portal API Server           ║
║                                       ║
║   📡 Port: ${PORT}                       ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}         ║
║   💚 Status: Running                  ║
╚═══════════════════════════════════════╝
  `);
});

module.exports = app;
