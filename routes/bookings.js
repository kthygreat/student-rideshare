const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

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

// GET /api/bookings/user/:userId - Get bookings by user
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ passengerId: req.params.userId })
      .populate('rideId')
      .sort({ bookedAt: -1 });
    
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
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
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
router.put('/:id', async (req, res) => {
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

// DELETE /api/bookings/:id - Delete a booking
router.delete('/:id', async (req, res) => {
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
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;