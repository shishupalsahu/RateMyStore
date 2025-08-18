// backend/controllers/adminController.js

const User = require('../models/User');
const Store = require('../models/Store');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalStores = await Store.countDocuments({});
    
    // To get total ratings, we need to aggregate from the stores collection
    const ratingStats = await Store.aggregate([
      {
        $group: {
          _id: null,
          totalRatings: { $sum: '$numRatings' },
        },
      },
    ]);

    const totalRatings = ratingStats.length > 0 ? ratingStats[0].totalRatings : 0;

    res.json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all users with filtering
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    // Build a filter object based on query parameters
    const filter = {};
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: 'i' }; // Case-insensitive search
    }
    if (req.query.email) {
      filter.email = { $regex: req.query.email, $options: 'i' };
    }
    if (req.query.role) {
      filter.role = req.query.role;
    }

    const users = await User.find(filter).select('-password'); // Exclude passwords from result
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getDashboardStats, getAllUsers };