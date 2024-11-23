const express = require('express');
const router = express.Router();
const { verifyToken, refreshTokenMiddleware } = require('../middleware/authMiddleware');

const {
  getComments,
  createComment,
  replyToComment,
} = require('../controllers/commentController');

router.get('/:postId', verifyToken,  getComments);
router.post('/:postId', verifyToken,  createComment);
router.post('/:commentId/replies', verifyToken,  replyToComment);

module.exports = router;