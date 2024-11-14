const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user', // Default role is 'user', set to 'admin' for admin accounts
        enum: ['user', 'admin']
    }
});

module.exports = mongoose.model('User', UserSchema);