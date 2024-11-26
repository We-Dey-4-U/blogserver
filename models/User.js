const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNumber: { type: String, unique: true },
    profileImage: { type: String },
    bio: { type: String },
    address: { type: String },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    role: {
        type: String,
        default: 'user', // Default role is 'user', set to 'admin' for admin accounts
        enum: ['user', 'admin']
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);