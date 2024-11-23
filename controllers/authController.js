const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assume a User model is defined in backend/models/User.js

//const JWT_SECRET = 'b708b14ccd6f4992b00b36b21bcacaef355ea960078550969c8c3c12a3a7bdca';  // Change this to your preferred secret key
const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash password and save user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ username, email, password: hashedPassword });
        await user.save();

        // Generate token
        const payload = { userId: user.id, username: user.username };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1y' });

        res.status(201).json({ token, message: 'User registered successfully.' });
    } catch (error) {
        console.error('Registration Error:', error.message);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Find user and verify password
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Generate token
        const payload = { userId: user.id, username: user.username };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1y' });

        res.status(200).json({ token, message: 'Logged in successfully.' });
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).send('Server Error');
    }
};