const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { auth, checkRole } = require('../middleware/auth');

// Get all tests
router.get('/', testController.getAllTests);
router.get('/:id', testController.getTestById);

// Protected routes
router.post('/', auth, checkRole('teacher', 'admin'), testController.createTest);
router.put('/:id', auth, checkRole('teacher', 'admin'), testController.updateTest);
router.delete('/:id', auth, checkRole('admin'), testController.deleteTest);

module.exports = router;
