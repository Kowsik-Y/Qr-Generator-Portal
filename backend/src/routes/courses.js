const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { auth, checkRole } = require('../middleware/auth');

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Protected routes (teacher/admin only)
router.post('/', auth, checkRole('teacher', 'admin'), courseController.createCourse);
router.put('/:id', auth, checkRole('teacher', 'admin'), courseController.updateCourse);
router.delete('/:id', auth, checkRole('admin'), courseController.deleteCourse);

module.exports = router;
