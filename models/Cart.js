const mongoose = require('mongoose');
const User = require('./User'); // Import User model for referencing the user

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ],
  totalPrice: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to calculate total price before saving
cartSchema.pre('save', function (next) {
  this.totalPrice = this.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
  next();
});

// Middleware to populate product and owner references when fetching cart
cartSchema.methods.populateCart = function() {
  return this.populate('products.product')
             .populate('products.owner')
             .execPopulate();
};

module.exports = mongoose.model('Cart', cartSchema);