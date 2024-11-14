const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  videoUrl: {
    type: String,
    default: null,
  },
  youtubeEmbed: {
    type: String,
    default: null,
  },
  facebookEmbed: {
    type: String,
    default: null,
  },
  twitterEmbed: {
    type: String,
    default: null,
  },
  instagramEmbed: {
    type: String,
    default: null,
  },
  likes: {
    type: Number,
    default: 0,
  }
}, { timestamps: true }); // Enables createdAt and updatedAt timestamps

module.exports = mongoose.model('Post', postSchema);