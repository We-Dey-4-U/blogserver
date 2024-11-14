// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

//app.use(cors({
  //  origin: 'https://stella-unadike-agenda-9xi3.vercel.app',  // Allow only this domain
  //  credentials: true,  // Allow cookies if needed
 // }));

// Serve static files from the "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB:', err));

// Define routes
app.use('/api/posts', require('./routes/posts'));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));