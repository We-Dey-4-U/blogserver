const Post = require('../models/Post');
const Comment = require('../models/Comment');
const path = require('path');

// Create a post with optional image, video, or YouTube embed
// Create a post with an optional image
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
        res.status(400).json({ message: error.message });
    }
};

// Get all posts (same as before)
// Get all posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }); // Sorting by creation date, newest first
        res.json(posts); // Return the posts as JSON
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch posts' }); // Return error if something goes wrong
    }
};
// Like a post (same as before)
exports.likePost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    post.likes += 1;
    await post.save();
    res.json(post);
};

// Create comment (same as before)
exports.createComment = async (req, res) => {
    const { content, author } = req.body;
    const comment = new Comment({ postId: req.params.postId, content, author });
    await comment.save();
    res.status(201).json(comment);
};