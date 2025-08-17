// backend/controllers/storeController.js

const Store = require('../models/Store');

// @desc    Create a new store
// @route   POST /api/stores
// @access  Private/Admin
const createStore = async (req, res) => {
  // ... (keep existing createStore function)
  const { name, email, address } = req.body;
  try {
    const store = new Store({ name, email, address });
    const createdStore = await store.save();
    res.status(201).json(createdStore);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch all stores and include user's rating
// @route   GET /api/stores
// @access  Private
// backend/controllers/storeController.js

// CORRECTED FUNCTION
// @desc    Fetch all stores and include user's rating
// @route   GET /api/stores
// @access  Private
const getStores = async (req, res) => {
  try {
    const stores = await Store.find({}).lean(); // .lean() makes it a plain JS object
    
    // For each store, check if the logged-in user has rated it
    const storesWithUserRating = stores.map(store => {
      let userRating = 0; // Default to 0
      
      // *** THIS IS THE FIX ***
      // Safely check if the ratings array exists and is not empty
      if (store.ratings && store.ratings.length > 0) {
        const ratingObj = store.ratings.find(
          (r) => r.user.toString() === req.user._id.toString()
        );
        if (ratingObj) {
            userRating = ratingObj.rating;
        }
      }

      return {
        ...store,
        userSubmittedRating: userRating, // Add the user's rating
      };
    });

    res.json(storesWithUserRating);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
// NEW FUNCTION
// @desc    Create or update a store rating
// @route   POST /api/stores/:id/ratings
// @access  Private
const createStoreRating = async (req, res) => {
  const { rating } = req.body;

  try {
    const store = await Store.findById(req.params.id);

    if (store) {
      const alreadyRated = store.ratings.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyRated) {
        // If user already rated, update their rating
        alreadyRated.rating = rating;
      } else {
        // Otherwise, add a new rating
        store.ratings.push({ rating, user: req.user._id });
      }

      // Recalculate average rating
      store.numRatings = store.ratings.length;
      store.averageRating =
        store.ratings.reduce((acc, item) => item.rating + acc, 0) /
        store.ratings.length;

      await store.save();
      res.status(201).json({ message: 'Rating added/updated' });
    } else {
      res.status(404).json({ message: 'Store not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// UPDATE THE EXPORTS
module.exports = { createStore, getStores, createStoreRating };