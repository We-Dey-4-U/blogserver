const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/blogpostuploadMidleware');



// Create a new post
router.post('/', upload.single('image'), postController.createPost);

// Get all posts
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);

// Like a post
router.post('/:id/like', postController.likePost);

// Comments for posts (already handled in comments routes)
module.exports = router;