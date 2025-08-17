// backend/controllers/storeController.js

const Store = require('../models/Store');

// @desc    Create a new store
// @route   POST /api/stores
// @access  Private/Admin
const createStore = async (req, res) => {
  // ... (keep the existing createStore function as is)
  const { name, email, address } = req.body;

  try {
    const store = new Store({
      name,
      email,
      address,
    });

    const createdStore = await store.save();
    res.status(201).json(createdStore);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// NEW FUNCTION
// @desc    Fetch all stores
// @route   GET /api/stores
// @access  Private
const getStores = async (req, res) => {
  try {
    const stores = await Store.find({}); // find({}) gets all documents
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// UPDATE THE EXPORTS
module.exports = { createStore, getStores };