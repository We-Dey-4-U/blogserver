const mongoose = require('mongoose');
const Comment = require('../models/Comment');

// Get comments for a specific post
exports.getComments = async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid postId format' });
  }

  try {
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    res.status(200).json(comments.length > 0 ? comments : { message: 'No comments found' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

// Create a new comment
exports.createComment = async (req, res) => {
  const { postId } = req.params;
  const { username, content } = req.body;

  if (!postId || !username || !content) {
      console.error('Missing required fields:', { postId, username, content });
      return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
      const newComment = new Comment({ postId, username, content });
      await newComment.save();
      res.status(201).json(newComment);
  } catch (error) {
      console.error('Error saving comment:', error.message);
      res.status(500).json({ message: 'Error saving comment', error: error.message });
  }
};

// Reply to a comment
exports.replyToComment = async (req, res) => {
  const { username, content } = req.body;
  const { commentId } = req.params;

  if (!username || !content) {
    return res.status(400).json({ message: 'Username and content are required.' });
  }

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ message: 'Invalid commentId format' });
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const reply = { username, content, createdAt: new Date() };
    comment.replies.push(reply);
    await comment.save();

    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: 'Error replying to comment', error: error.message });
  }
};