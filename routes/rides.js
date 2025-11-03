const express = require('express');
const router = express.Router();

// GET /api/rides
router.get('/', (req, res) => {
  res.json({ 
    message: 'Ride routes are working!',
    endpoints: {
      getRides: 'GET /api/rides',
      createRide: 'POST /api/rides',
      getRide: 'GET /api/rides/:id',
      updateRide: 'PUT /api/rides/:id',
      deleteRide: 'DELETE /api/rides/:id'
    }
  });
});

module.exports = router;