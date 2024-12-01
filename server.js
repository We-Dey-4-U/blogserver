const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet'); // Adds security headers
const rateLimit = require('express-rate-limit'); // Rate limiting
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize'); // Prevent NoSQL injections
const xssClean = require('xss-clean'); // Prevent XSS attacks

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(helmet()); // Secure headers
app.use(mongoSanitize()); // NoSQL injection protection
app.use(xssClean()); // XSS protection

// Rate limiter to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// CORS configuration for development
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Authorization', 'Content-Type'], // Allowed headers
  credentials: true, // Allow credentials
}));

// CORS configuration
//app.use(cors({
 // origin: ['https://stella-unadike-agenda-9xi3.vercel.app'], // Allow only your frontend domain
//  methods: ['GET', 'POST', 'PUT', 'DELETE'],
//  allowedHeaders: ['Authorization', 'Content-Type'],
//  credentials: true, // Allow credentials (e.g., cookies, auth headers)
//}));

// Static file serving
app.use('/uploads/profile-images', express.static(path.join(__dirname, 'uploads/profile-images')));
app.use('/uploads/product-images', express.static(path.join(__dirname, 'uploads/product-images')));
app.use('/uploads/post-images', express.static(path.join(__dirname, 'uploads/post-images')));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

// Routes
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const storeRoutes = require('./routes/storeRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const cartRoutes = require('./routes/cartRoutes');

app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));