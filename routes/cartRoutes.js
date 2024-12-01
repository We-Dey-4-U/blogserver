// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');

// Ensure that these methods exist in cartController and are correctly exported
router.post('/add', verifyToken, cartController.addToCart);
router.get('/', verifyToken, cartController.getCart);
router.post('/update', verifyToken, cartController.updateQuantity);
router.post('/remove', verifyToken, cartController.removeItem);

module.exports = router;