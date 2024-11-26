const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // User purchasing the product(s)
    seller: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // User selling the product(s)
    products: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product', 
                required: true 
            }, // Reference to the product
            quantity: { 
                type: Number, 
                required: true 
            }, // Number of units purchased
            price: { 
                type: Number, 
                required: true 
            }, // Price per unit
        }
    ], // Array to support multiple products in one order
    totalAmount: { 
        type: Number, 
        required: true 
    }, // Calculated total for all products
    status: { 
        type: String, 
        enum: ['pending', 'completed', 'cancelled'], 
        default: 'pending' 
    }, // Current status of the order
    createdAt: { 
        type: Date, 
        default: Date.now 
    }, // Order creation time
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }, // Last update time
});

// Automatically update `updatedAt` on document save
orderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Order', orderSchema);