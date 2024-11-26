const Order = require('../models/Order');
const Product = require('../models/Product'); // Assuming you have a Product model
const User = require('../models/User'); // Assuming you have a User model

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { buyer, seller, products, totalAmount } = req.body;

        // Validate buyer and seller
        const buyerUser = await User.findById(buyer);
        const sellerUser = await User.findById(seller);

        if (!buyerUser || !sellerUser) {
            return res.status(400).json({ message: 'Buyer or Seller not found' });
        }

        // Check if all products exist and are available
        for (const product of products) {
            const productExists = await Product.findById(product.productId);
            if (!productExists) {
                return res.status(400).json({ message: `Product with id ${product.productId} not found` });
            }
        }

        // Create new order
        const newOrder = new Order({
            buyer,
            seller,
            products,
            totalAmount,
            status: 'pending',
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
};

// Get all orders for a user (buyer or seller)
const getOrders = async (req, res) => {
    try {
        const { userId, role } = req.query; // role could be 'buyer' or 'seller'

        if (role === 'buyer') {
            const orders = await Order.find({ buyer: userId }).populate('products.productId').populate('seller');
            return res.status(200).json(orders);
        }

        if (role === 'seller') {
            const orders = await Order.find({ seller: userId }).populate('products.productId').populate('buyer');
            return res.status(200).json(orders);
        }

        res.status(400).json({ message: 'Invalid role' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve orders', error: error.message });
    }
};

// Update the order status (e.g., to 'completed' or 'cancelled')
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!['pending', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        order.updatedAt = Date.now(); // Update the `updatedAt` field
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update order', error: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus,
};