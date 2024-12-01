// controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

// Add product to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.userId;

        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Product ID and valid quantity are required.' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (productIndex >= 0) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({
                product: productId,
                quantity,
                name: product.name,
                price: product.price,
                image: product.image,
                owner: product.owner, // Populate owner
            });
        }

        await cart.save();
        res.status(200).json({ message: 'Product added to cart successfully.', cart });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Failed to add product to cart', error: error.message });
    }
};

  
  // Get user's cart with populated products
  exports.getCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = await Cart.findOne({ user: userId })
            .populate('products.product', 'name price image owner') // Populate product details
            .populate('products.owner', 'username email'); // Populate owner details

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
    }
};
  
  // Update product quantity in cart
  exports.updateQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.userId;

        if (!productId || quantity === undefined || quantity <= 0) {
            return res.status(400).json({ message: 'Product ID and valid quantity are required.' });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (productIndex < 0) {
            return res.status(404).json({ message: 'Product not found in cart.' });
        }

        cart.products[productIndex].quantity = quantity;
        cart.updatedAt = Date.now(); // Update timestamp

        await cart.save();
        res.status(200).json({ message: 'Product quantity updated successfully.', cart });
    } catch (error) {
        console.error('Error updating product quantity:', error);
        res.status(500).json({ message: 'Failed to update product quantity', error: error.message });
    }
};



  // Remove product from cart
  exports.removeItem = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.userId;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required.' });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (productIndex < 0) {
            return res.status(404).json({ message: 'Product not found in cart.' });
        }

        cart.products.splice(productIndex, 1);
        cart.updatedAt = Date.now(); // Update timestamp

        await cart.save();
        res.status(200).json({ message: 'Product removed from cart successfully.', cart });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ message: 'Failed to remove product from cart', error: error.message });
    }
};