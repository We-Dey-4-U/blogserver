const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Replace with your secure key management strategy in production
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Correct placement of variable declaration

    if (!authHeader) {
        console.error('Authorization header missing.');
        return res.status(401).json({ message: 'Authorization header is missing.' });
    }

    const token = authHeader.split(' ')[1]; // Correctly extract the token
    if (!token) {
        console.error('Token missing in Authorization header.');
        return res.status(401).json({ message: 'Token is missing in the Authorization header.' });
    }

    console.log('Token received:', token);

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT Verification Error:', err.message);
            const message = err.name === 'TokenExpiredError' ? 'Token expired.' :
                            err.name === 'JsonWebTokenError' ? 'Malformed token.' :
                            'Invalid token.';
            return res.status(401).json({ message });
        }

        req.user = decoded; // Add the decoded payload to the request object
        next();
    });
};

// Middleware to refresh JWT token
exports.refreshTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Correct placement
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;

        // Generate a new token
        const newToken = jwt.sign({ id: verified.id }, JWT_SECRET, { expiresIn: '1y' });
        res.setHeader('x-refreshed-token', newToken);

        next();
    } catch (err) {
        console.error('Refresh Token Error:', err.message);
        return res.status(400).json({ message: 'Invalid or expired token for refresh.' });
    }
};

// Middleware to check if the user is an admin
exports.isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied, admin only.' });
        }
        next();
    } catch (error) {
        console.error('Admin Check Error:', error.message);
        return res.status(500).json({ message: 'Server error.' });
    }
};