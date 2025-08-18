// backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Apply admin protection to all routes in this file
router.use(protect, admin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);

module.exports = router;