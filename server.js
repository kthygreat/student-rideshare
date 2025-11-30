// server.js - Updated for Student Rideshare App
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Added for serving static files
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const session = require('express-session');

// Simple session middleware (used for auth state)
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// ✅ ADDED: Serve static files from public folder (CSS, JS, Images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Atlas Connection
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas successfully');
  console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected from MongoDB Atlas');
});

// Import your EXISTING rideshare routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const rideRoutes = require('./routes/rides');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');

// Use your EXISTING rideshare routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// ✅ UPDATED: Serve frontend for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ ADDED: API info endpoint (moved from root)
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Welcome to Student Rideshare Backend API',
    version: '1.0.0',
    database: 'MongoDB Atlas',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users', 
      rides: '/api/rides',
      bookings: '/api/bookings',
      admin: '/api/admin'
    },
    timestamp: new Date().toISOString()
  });
});

// ✅ ADDED: Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'OK', 
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// ✅ ADDED: Catch-all handler to serve frontend for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Student Rideshare Server running on port ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
  console.log(`📁 Serving frontend from: ${path.join(__dirname, 'public')}`);
  console.log(`⚡ API endpoints available at: http://localhost:${PORT}/api`);
});