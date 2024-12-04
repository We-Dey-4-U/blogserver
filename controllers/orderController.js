const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');


// Place an Order
 // Create a new order
exports.createOrder = async (req, res) => {
    try {
      const { buyer, products, totalAmount } = req.body;
  
      if (!buyer || !products || products.length === 0 || !totalAmount) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Check product stock
      for (const item of products) {
        console.log(`Received Product ID for validation: ${item.productId}`); // Debug log
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
        }
  
        if (product.quantity < item.quantity) {
          return res
            .status(400)
            .json({ message: `Insufficient stock for product: ${product.name}` });
        }
      }
  
      // Deduct stock from each product
      for (const item of products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: -item.quantity },
        });
      }
  
      // Create order
      const newOrder = new Order({
        buyer,
        products,
        totalAmount,
      });
  
      const savedOrder = await newOrder.save();
      res.status(201).json({ message: 'Order placed successfully', order: savedOrder });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  // Get all orders for a user
  exports.getOrdersByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const orders = await Order.find({ buyer: userId }).populate('products.productId');
      res.status(200).json({ orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  // Get a specific order by ID
 // Get a specific order by ID
exports.getOrderById = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Check if orderId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID' });
      }
  
      const order = await Order.findById(orderId).populate('products.productId');
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json({ order });
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };