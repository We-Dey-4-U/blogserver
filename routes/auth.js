const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middleware/profileuploadMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');



// Register a user
router.post('/register', authController.register);

// Login a user
router.post('/login', authController.login);

router.get('/dashboard', verifyToken, authController.getUserDashboard);

router.put('/updateProfile', verifyToken, upload.single('profileImage'), authController.updateProfile);

module.exports = router;