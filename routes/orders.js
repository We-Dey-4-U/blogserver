const express = require('express');
const router = express.Router();
const { createOrder, getOrdersByUser, getOrderById } = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware'); // Import middleware for token verification

// Create a new order
router.post('/', verifyToken, createOrder);

// Route to get all orders for a specific user
router.get('/user/:userId', verifyToken, getOrdersByUser);

// Route to get a specific order by ID
router.get('/:orderId', verifyToken, getOrderById);

// Update order status
//router.put('/status', verifyToken, orderController.updateOrderStatus);

// Get order statistics
//router.get('/stats', verifyToken, orderController.getOrderStats);

// Get seller's orders
//router.get('/seller', verifyToken, orderController.getSellerOrders);

// Get buyer's orders
//router.get('/buyer', verifyToken, orderController.getBuyerOrders);

// Get total order count for the seller's products
//router.get('/seller/order-count', verifyToken, orderController.getOwnerOrderCount);



module.exports = router;