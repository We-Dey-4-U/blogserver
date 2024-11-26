const Store = require('../models/Store');
const User = require('../models/User');
const Product = require('../models/Product');

// Create a new store
const createStore = async (req, res) => {
  try {
    const { owner, name, description, products } = req.body;

    const user = await User.findById(owner);
    if (!user) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    const newStore = new Store({
      owner,
      name,
      description,
      products,
    });

    await newStore.save();
    res.status(201).json(newStore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create store', error: error.message });
  }
};

// Get store by id
const getStore = async (req, res) => {
  try {
    const storeId = req.params.storeId;

    const store = await Store.findById(storeId).populate('owner').populate('products');
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.status(200).json(store);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve store', error: error.message });
  }
};

// Update store details
const updateStore = async (req, res) => {
  try {
    const storeId = req.params.storeId;
    const { name, description, products } = req.body;

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    store.name = name || store.name;
    store.description = description || store.description;
    store.products = products || store.products;
    store.updatedAt = Date.now();

    await store.save();
    res.status(200).json(store);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update store', error: error.message });
  }
};

// Delete store
const deleteStore = async (req, res) => {
  try {
    const storeId = req.params.storeId;

    const store = await Store.findByIdAndDelete(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete store', error: error.message });
  }
};

module.exports = {
  createStore,
  getStore,
  updateStore,
  deleteStore,
};