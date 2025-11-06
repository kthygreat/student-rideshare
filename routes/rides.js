const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');

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
router.post('/', async (req, res) => {
  try {
    const ride = new Ride(req.body);
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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