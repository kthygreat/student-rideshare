const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, studentId, program, graduationYear, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { studentId }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email or student ID already exists'
      });
    }
    
    const user = new User({
      username,
      email,
      password,
      studentId,
      program,
      graduationYear,
      role: role || 'rider'
    });
    
    const savedUser = await user.save();
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Check password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    // Set session user id
    try {
      req.session.userId = user._id.toString();
      req.session.username = user.username;
    } catch (e) {
      // sessions may not be available in some dev setups
      console.warn('Session not available:', e.message);
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

// GET /api/auth/profile - current logged in user (session)
router.get('/profile', async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = await User.findById(req.session.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) return res.status(500).json({ success: false, message: 'Logout failed' });
      res.clearCookie('connect.sid');
      return res.json({ success: true, message: 'Logged out' });
    });
  } else {
    res.json({ success: true, message: 'No active session' });
  }
});