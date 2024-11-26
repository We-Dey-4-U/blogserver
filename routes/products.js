const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/uploadMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

// Create a product
// Product Routes
router.post('/', verifyToken, upload.single('productImage'), productController.createProduct);
router.get('/', verifyToken, productController.getProducts);
router.get('/analytics', verifyToken, productController.getUserProductAnalytics);

module.exports = router;