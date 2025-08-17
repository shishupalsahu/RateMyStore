// backend/controllers/storeController.js

const Store = require('../models/Store');

// @desc    Create a new store
// @route   POST /api/stores
// @access  Private/Admin
const createStore = async (req, res) => {
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

module.exports = { createStore };