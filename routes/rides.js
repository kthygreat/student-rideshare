const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const { requireAuth } = require('../middleware/auth');

// GET /api/rides - Get all rides
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find();
    res.json({
      success: true,
      count: rides.length,
      data: rides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/rides/available - Get available rides
router.get('/available', async (req, res) => {
  try {
    const rides = await Ride.find({ 
      status: 'available',
      departureTime: { $gte: new Date() }
    }).sort({ departureTime: 1 });
    
    res.json({
      success: true,
      count: rides.length,
      data: rides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/rides/my-rides - Get current user's rides (as driver)
// THIS MUST BE BEFORE /:id route
router.get('/my-rides', requireAuth, async (req, res) => {
  try {
    const rides = await Ride.find({ driverId: req.session.userId });
    
    res.json({
      success: true,
      count: rides.length,
      data: rides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/rides/driver/:driverId - Get rides by driver
router.get('/driver/:driverId', async (req, res) => {
  try {
    const rides = await Ride.find({ driverId: req.params.driverId });
    
    res.json({
      success: true,
      count: rides.length,
      data: rides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/rides/:id - Get a specific ride
// THIS MUST BE LAST among GET routes with parameters
router.get('/:id', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      return res.status(404).json({
        success: false,
        error: 'Ride not found'
      });
    }
    
    res.json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/rides - Create a new ride
router.post('/', requireAuth, async (req, res) => {
  try {
    // Automatically add the logged-in user as the driver
    const rideData = {
      ...req.body,
      driverId: req.session.userId
    };
    
    const ride = new Ride(rideData);
    const savedRide = await ride.save();
    
    res.status(201).json({
      success: true,
      data: savedRide
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/rides/:id - Update a ride
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!ride) {
      return res.status(404).json({
        success: false,
        error: 'Ride not found'
      });
    }
    
    res.json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/rides/:id - Delete a ride
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const ride = await Ride.findByIdAndDelete(req.params.id);
    
    if (!ride) {
      return res.status(404).json({
        success: false,
        error: 'Ride not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Ride deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;