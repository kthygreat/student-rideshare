const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { requireAuth } = require('../middleware/auth');

// GET /api/bookings - Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('rideId');
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/bookings/my-bookings - Get current user's bookings (as passenger)
// THIS MUST BE BEFORE /:id route
router.get('/my-bookings', requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ passengerId: req.session.userId })
      .populate('rideId')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/bookings/user/:userId - Get bookings by user
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ passengerId: req.params.userId })
      .populate('rideId')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/bookings/:id - Get a specific booking
// THIS MUST BE LAST among GET routes with parameters
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('rideId');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/bookings - Create a new booking
router.post('/', requireAuth, async (req, res) => {
  try {
    // Automatically add the logged-in user as the passenger
    const bookingData = {
      ...req.body,
      passengerId: req.session.userId
    };
    
    const booking = new Booking(bookingData);
    const savedBooking = await booking.save();
    
    res.status(201).json({
      success: true,
      data: savedBooking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/bookings/:id - Update a booking
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/bookings/:id - Delete a booking (cancel)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;