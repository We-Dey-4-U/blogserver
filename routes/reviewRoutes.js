const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/authMiddleware');// Assuming you have token verification middleware

// Create a new review
router.post('/', verifyToken, reviewController.createReview);

// Get all reviews for a product
router.get('/product/:productId', reviewController.getReviews);

// Update a review
router.put('/:reviewId', verifyToken, reviewController.updateReview);

module.exports = router;