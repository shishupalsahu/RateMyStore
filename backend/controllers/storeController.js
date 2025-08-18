// backend/controllers/storeController.js
const Store = require('../models/Store');

// @desc    Create a new store
// @route   POST /api/stores
// @access  Private/Admin
const createStore = async (req, res) => {
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
const getStores = async (req, res) => {
  try {
    const stores = await Store.find({}).lean();
    
    const storesWithUserRating = stores.map(store => {
      let userRating = 0;
      if (store.ratings && store.ratings.length > 0) {
        const ratingObj = store.ratings.find(
          (r) => r.user.toString() === req.user._id.toString()
        );
        if (ratingObj) {
            userRating = ratingObj.rating;
        }
      }
      // This simplified return ensures the ID is always present.
      return {
        _id: store._id, 
        name: store.name,
        address: store.address,
        averageRating: store.averageRating,
        numRatings: store.numRatings,
        userSubmittedRating: userRating,
      };
    });

    res.json(storesWithUserRating);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create or update a store rating
// @route   POST /api/stores/:id/ratings
// @access  Private
const createStoreRating = async (req, res) => {

  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Please provide a rating between 1 and 5.' });
  }

  try {
    const store = await Store.findById(req.params.id);

    if (store) {
      const alreadyRated = store.ratings.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyRated) {
        alreadyRated.rating = rating;
      } else {
        store.ratings.push({ rating, user: req.user._id });
      }

      store.numRatings = store.ratings.length;
      store.averageRating =
        store.ratings.reduce((acc, item) => item.rating + acc, 0) /
        store.ratings.length;

      await store.save();
      res.status(201).json({ message: 'Rating added/updated successfully' });
    } else {
      res.status(404).json({ message: 'Store not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createStore, getStores, createStoreRating };
