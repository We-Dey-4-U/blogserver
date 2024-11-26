const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware');// Assuming you have token verification middleware

// Create a new order
router.post('/', verifyToken, orderController.createOrder);

// Get all orders for a user (buyer or seller)
router.get('/', verifyToken, orderController.getOrders);

// Update the status of an order
router.put('/status', verifyToken, orderController.updateOrderStatus);

module.exports = router;