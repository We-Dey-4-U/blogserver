const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getComments,
  createComment,
  replyToComment,
} = require('../controllers/commentController');

router.get('/:postId', verifyToken, refreshTokenMiddleware, getComments);
router.post('/:postId', verifyToken, refreshTokenMiddleware, createComment);
router.post('/:commentId/replies', verifyToken, refreshTokenMiddleware, replyToComment);

module.exports = router;