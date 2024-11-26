const Product = require('../models/Product');
const User = require('../models/User'); // Import User model

// Create a new product
exports.createProduct = async (req, res) => {
    const { name, description, price, quantity } = req.body;

    // Handle product image
    let imageUrl = null;
    if (req.file) {
        imageUrl = `/uploads/product-images/${req.file.filename}`;
    }

    const product = new Product({
        name,
        description,
        price,
        quantity,
        image: imageUrl,
        owner: req.user.userId // Assuming `verifyToken` middleware adds `user` to `req`
    });

    try {
        await product.save();

        // Update the user's products array
        const user = await User.findById(req.user.userId);
        user.products.push(product);
        await user.save();

        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ message: 'Failed to create product', error: error.message });
    }
};

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }).populate('owner', 'username email');
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
};

// Get analytics for user's products
exports.getUserProductAnalytics = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Fetch user's products and aggregate sales data
        const products = await Product.find({ owner: userId }).lean();
        const analytics = await Order.aggregate([
            { $match: { "products.owner": userId } }, // Filter for the user's products
            { $unwind: "$products" },
            { $group: {
                _id: "$products.productId",
                totalRevenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
                totalSales: { $sum: "$products.quantity" },
            }},
        ]);

        res.status(200).json({ products, analytics });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
    }
};




