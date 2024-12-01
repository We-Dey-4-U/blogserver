const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
      name: { type: String, required: true },  // Add product name
      price: { type: Number, required: true }, // Add product price
      image: { type: String, required: true }, // Add product image URL
      owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to Product Owner
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cart', cartSchema);