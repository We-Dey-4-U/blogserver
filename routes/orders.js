const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController'); // Import order controller
const { verifyToken } = require('../middleware/authMiddleware'); // Import middleware for token verification
// Create a new order
router.post('/', verifyToken, orderController.createOrder);
router.get('/', verifyToken, orderController.getOrders);
router.put('/status', verifyToken, orderController.updateOrderStatus);
router.get('/stats', verifyToken, orderController.getOrderStats);
router.get('/seller', verifyToken, orderController.getSellerOrders);
router.get('/buyer', verifyToken, orderController.getBuyerOrders);


module.exports = router;