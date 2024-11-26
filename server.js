const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Initialize environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());


// Serve static files from specific directories for images
app.use('/uploads/profile-images', express.static(path.join(__dirname, 'uploads/profile-images')));
app.use('/uploads/product-images', express.static(path.join(__dirname, 'uploads/product-images')));
app.use('/uploads/post-images', express.static(path.join(__dirname, 'uploads/post-images')));
// Serve static files
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
// setHeaders: (res) => {
//    res.setHeader('Cache-Control', 'public, max-age=3600');
//},
//}));

// MongoDB Connection
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
const orderRoutes = require('./routes/orders'); // Import order routes
const storeRoutes = require('./routes/storeRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reviewRoutes = require('./routes/reviewRoutes');


app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // This will handle the `/api/products` endpoint
app.use('/api/orders', orderRoutes); // Add orders route
app.use('/api/stores', storeRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);

// Handle invalid routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));