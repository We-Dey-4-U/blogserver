const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { verifyToken } = require('../middleware/authMiddleware'); // Assuming you have token verification middleware

// Create a new store
router.post('/', verifyToken, storeController.createStore);

// Get store by ID
router.get('/:storeId', storeController.getStore);

// Update store details
router.put('/:storeId', verifyToken, storeController.updateStore);

// Delete store
router.delete('/:storeId', verifyToken, storeController.deleteStore);

module.exports = router;