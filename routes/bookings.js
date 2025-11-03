const express = require('express');
const router = express.Router();

// GET /api/bookings
router.get('/', (req, res) => {
  res.json({ 
    message: 'Booking routes are working!',
    endpoints: {
      createBooking: 'POST /api/bookings',
      getBookings: 'GET /api/bookings/user/:userId',
      cancelBooking: 'DELETE /api/bookings/:id'
    }
  });
});

module.exports = router;