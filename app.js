// Add this at the very top of app.js
import process from 'process';
// or if using CommonJS:
// const process = require('process');
const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// ✅ ADD THIS - Database connection
const connectDB = require('./config/database');
connectDB();

const app = express();

// Add CORS support (before your routes)
app.use(cors());

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Simple session setup
app.use(require('express-session')({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false
}));

// Import and use routes
console.log('🔧 Loading routes...');

// Import routes directly
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users'); 
const rideRoutes = require('./routes/rides');
const bookingRoutes = require('./routes/bookings');

console.log('✅ Routes imported successfully');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/bookings', bookingRoutes);

console.log('✅ Routes mounted successfully');

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '🚗 Student Ride Share API is running!',
    timestamp: new Date().toISOString(),
    status: 'OK',
    endpoints: [
      'GET /api/auth',
      'GET /api/users', 
      'GET /api/rides',
      'GET /api/bookings'
    ]
  });
});

// Admin routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Handle 404 errors
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    availableRoutes: [
      'GET /',
      'GET /api/auth',
      'GET /api/users', 
      'GET /api/rides',
      'GET /api/bookings',
      'GET /api/admin/students',
      'GET /api/admin/stats'
    ]
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('✨ ======================================== ✨');
  console.log(`🚀 Server started successfully on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log('✨ ======================================== ✨');
  console.log('✅ Available endpoints:');
  console.log('   GET  /');
  console.log('   GET  /api/auth');
  console.log('   GET  /api/users');
  console.log('   GET  /api/rides');
  console.log('   GET  /api/bookings');
  console.log('   GET  /api/admin/students');
  console.log('   GET  /api/admin/stats');
});
