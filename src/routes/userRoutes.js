const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// 모든 라우트는 인증 필요
router.use(authenticate);

// User routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Manager routes
router.get('/users', authorize('MANAGER', 'ADMIN'), userController.getAllUsers);
router.get('/users/:id', authorize('MANAGER', 'ADMIN'), userController.getUserById);

// Admin routes
router.delete('/users/:id', authorize('ADMIN'), userController.deleteUser);

module.exports = router;