const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/productuploadMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

// Create a product
// Product Routes
router.post('/', verifyToken, upload.single('productImage'), productController.createProduct);
router.get('/', verifyToken, productController.getProducts);
// Get products for the logged-in user
router.get('/user', verifyToken, productController.getUserProducts);
// Route to get products with count
router.get('/my-product-count',verifyToken,  productController.getUserProductCount);
router.get('/with-count', verifyToken, productController.getProductsWithCount);
router.get('/analytics', verifyToken, productController.getUserProductAnalytics);

module.exports = router;