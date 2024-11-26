const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');

// Create a new review
const createReview = async (req, res) => {
  try {
    const { user, product, rating, comment } = req.body;

    const userExists = await User.findById(user);
    const productExists = await Product.findById(product);

    if (!userExists || !productExists) {
      return res.status(404).json({ message: 'User or Product not found' });
    }

    const newReview = new Review({
      user,
      product,
      rating,
      comment,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create review', error: error.message });
  }
};

// Get all reviews for a product
const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId }).populate('user');
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve reviews', error: error.message });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { reviewId, rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    review.createdAt = Date.now();

    await review.save();
    res.status(200).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update review', error: error.message });
  }
};

module.exports = {
  createReview,
  getReviews,
  updateReview,
};