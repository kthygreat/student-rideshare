// server.js - Updated for Student Rideshare App
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); //


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// Basic route
app.get('/', (req, res) => {
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Student Rideshare Server running on port ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
});