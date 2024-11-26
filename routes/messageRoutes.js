const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { verifyToken } = require('../middleware/authMiddleware');// Assuming you have token verification middleware

// Send a new message
router.post('/', verifyToken, messageController.sendMessage);

// Get messages for a user
router.get('/:userId', verifyToken, messageController.getMessages);

// Mark a message as read
router.put('/:messageId/read', verifyToken, messageController.markAsRead);

module.exports = router;