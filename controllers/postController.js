const Post = require('../models/Post');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');
const path = require('path');

// Create a post with optional image, video, or YouTube embed
exports.createPost = async (req, res) => {
    const { title, content, author, videoUrl, youtubeEmbed, facebookEmbed, twitterEmbed, instagramEmbed } = req.body;

    let imageUrl = null;
    if (req.file) {
        imageUrl = `/uploads/post-images/${req.file.filename}`;
    }

    const post = new Post({
        title,
        content,
        author,
        image: imageUrl,
        videoUrl,
        youtubeEmbed,
        facebookEmbed,
        twitterEmbed,
        instagramEmbed,
    });

    try {
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error('Error saving post:', error);
        res.status(400).json({ message: 'Failed to create post', error: error.message });
    }
};

// Fetch all posts with enhanced error handling
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
    }
};

// Like a post with error handling
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.likes += 1;
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Failed to like post', error: error.message });
    }
};



// Fetch a single post by ID with enhanced error handling
exports.getPost = async (req, res) => {
    const { id } = req.params;

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid post ID' });
    }

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Failed to fetch post', error: error.message });
    }
};
// Add a comment to a post
// Add a comment to a post





