const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
      const { name, description, price, quantity } = req.body;
      if (!name || !description || !price || !quantity || !req.file) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      const imageUrl = `/uploads/product-images/${req.file.filename}`;
      const product = new Product({
        name,
        description,
        price,
        quantity,
        image: imageUrl,
        owner: req.user.userId,
      });
  
      await product.save();
  
      const user = await User.findById(req.user.userId);
      user.products.push(product);
      await user.save();
  
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error creating product.', error: error.message });
    }
  };



// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate('owner', 'username email');
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// Get user product analytics
exports.getUserProductAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;

    const products = await Product.find({ owner: userId }).lean();
    const analytics = await Order.aggregate([
      { $match: { 'products.owner': userId } },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.productId',
          totalRevenue: { $sum: { $multiply: ['$products.price', '$products.quantity'] } },
          totalSales: { $sum: '$products.quantity' },
        },
      },
    ]);

    res.status(200).json({ products, analytics });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};



// Get products by user
exports.getUserProducts = async (req, res) => {
    try {
      const userId = req.user.userId; // Retrieved from the JWT token via `verifyToken` middleware
      const userProducts = await Product.find({ owner: userId }).sort({ createdAt: -1 });
  
      if (!userProducts.length) {
        return res.status(404).json({ message: 'No products found for this user.' });
      }
  
      res.status(200).json(userProducts);
    } catch (error) {
      console.error('Error fetching user products:', error);
      res.status(500).json({ message: 'Failed to fetch user products', error: error.message });
    }
  };


  // Get all products with total count
  exports.getProductsWithCount = async (req, res) => {
    try {
        console.log('Fetching products...');
        const products = await Product.find().sort({ createdAt: -1 }).populate('owner', 'username email');
        const totalProduct = await Product.countDocuments();

        console.log(`Found ${totalProduct} products`);
        res.status(200).json({ products, totalProduct });
    } catch (error) {
        console.error('Error in getProductsWithCount:', error.message);
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
};




// Get product count by logged-in user
exports.getUserProductCount = async (req, res) => {
    try {
      const userId = req.user.userId; // Get user ID from JWT token
  
      const productCount = await Product.countDocuments({ owner: userId }); // Count products uploaded by the user
      res.status(200).json({ productCount }); // Send the product count back
    } catch (error) {
      console.error('Error fetching product count:', error);
      res.status(500).json({ message: 'Failed to fetch product count', error: error.message });
    }
  };



  // Fetch product by ID
 // Fetch product by ID
exports.getProductById = async (req, res) => {
  try {
      const { productId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(productId)) {
          return res.status(400).json({ message: 'Invalid Product ID.' });
      }

      const product = await Product.findById(productId);
      if (!product) {
          return res.status(404).json({ message: 'Product not found.' });
      }

      res.status(200).json({ product });
  } catch (error) {
      console.error('Error fetching product by ID:', error.message);
      res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};



