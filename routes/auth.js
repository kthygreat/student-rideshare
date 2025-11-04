const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// GET /api/auth - Test route
router.get('/', (req, res) => {
  res.json({ 
    message: 'Auth routes are working!',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login', 
      logout: 'GET /api/auth/logout',
      profile: 'GET /api/auth/profile',
      testUsers: 'GET /api/auth/test-users' // For testing
    }
  });
});

// POST /api/auth/register - User registration
router.post('/register', authController.register);

// POST /api/auth/login - User login  
router.post('/login', authController.login);

// GET /api/auth/logout - User logout
router.get('/logout', authController.logout);

// GET /api/auth/profile - Get user profile
router.get('/profile', authController.getProfile);

// GET /api/auth/test-users - Get all users (for testing)
router.get('/test-users', authController.getAllUsers);

module.exports = router;
// GET /api/auth/enhanced-profile - Get Zimride-style profile
router.get('/enhanced-profile', authController.getEnhancedProfile);
