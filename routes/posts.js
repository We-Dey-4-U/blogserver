const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// @route   POST /api/posts
// @desc    Create a new post (admin only)
// @access  Private
//router.post('/',upload.single('image'), verifyToken, isAdmin, postController.createPost);


router.post('/',upload.single('image'),  postController.createPost);

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', postController.getPosts);

// @route   POST /api/posts/:id/like
// @desc    Like a post
// @access  Public
router.post('/:id/like', postController.likePost);

// @route   POST /api/posts/:postId/comments
// @desc    Create a comment on a post
// @access  Public
router.post('/:postId/comments', postController.createComment);

module.exports = router;