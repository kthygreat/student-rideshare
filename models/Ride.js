const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  carDetails: {
    make: String,
    model: String,
    color: String,
    licensePlate: String
  },
  status: {
    type: String,
    enum: ['available', 'full', 'completed', 'cancelled'],
    default: 'available'
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Ride', rideSchema);