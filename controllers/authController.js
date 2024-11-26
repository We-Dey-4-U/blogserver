const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Message = require('../models/Message');

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const payload = { userId: user.id, username: user.username, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1y' });

    res.status(201).json({ token, message: 'User registered successfully.' });
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const payload = { userId: user.id, username: user.username, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1y' });

    res.status(200).json({
      token,
      user: {
        username: user.username,
        email: user.email,
        bio: user.bio,
        address: user.address,
        profileImage: user.profileImage,
        role: user.role,
      },
      message: 'Logged in successfully.',
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get user dashboard data
exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('profileImage bio address').lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const products = await Product.find({ owner: userId }).select('name price').lean();
    const orders = await Order.find({ "products.owner": userId }).lean();
    const messages = await Message.find({ recipient: userId }).lean();

    const totalRevenue = products.reduce((sum, p) => sum + p.price, 0);

    res.status(200).json({
      ...user,
      products,
      orders,
      messages,
      totalRevenue,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};

// Update user profile
// Update user profile
exports.updateProfile = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { bio, address } = req.body;
      const updateFields = { bio, address };
  
      // If there's an uploaded file, add the path to the user object
      if (req.file) {
        updateFields.profileImage = `/uploads/profile-images/${req.file.filename}`;
      }
  
      const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateFields }, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  };