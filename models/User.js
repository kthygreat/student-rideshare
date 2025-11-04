const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  
  // Student Verification (Zimride-style)
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true
  },
  university: {
    type: String,
    default: 'Centennial College'
  },
  program: {
    type: String,
    required: [true, 'Program of study is required'],
    trim: true
  },
  graduationYear: {
    type: Number,
    required: [true, 'Graduation year is required'],
    min: [2023, 'Invalid graduation year'],
    max: [2030, 'Invalid graduation year']
  },
  
  // Contact Information
  phone: {
    type: String,
    trim: true
  },
  
  // Driver Information (Zimride-style)
  isDriver: {
    type: Boolean,
    default: false
  },
  vehicle: {
    make: String,
    model: String,
    color: String,
    licensePlate: String,
    year: Number
  },
  
  // Ride Preferences (Social Features)
  ridePreferences: {
    music: {
      type: String,
      enum: ['quiet', 'casual', 'enthusiast'],
      default: 'casual'
    },
    conversation: {
      type: String,
      enum: ['quiet', 'casual', 'talkative'],
      default: 'casual'
    },
    smoking: {
      type: Boolean,
      default: false
    },
    pets: {
      type: Boolean,
      default: false
    }
  },
  
  // Ratings & Reviews (Zimride-style)
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    breakdown: {
      punctuality: { type: Number, default: 0 },
      safety: { type: Number, default: 0 },
      cleanliness: { type: Number, default: 0 },
      friendliness: { type: Number, default: 0 }
    }
  },
  
  // Profile Completeness (Gamification)
  profileComplete: {
    type: Boolean,
    default: false
  },
  profileCompletion: {
    type: Number,
    default: 0
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate profile completion percentage
userSchema.methods.calculateProfileCompletion = function() {
  let completed = 0;
  let total = 0;
  
  // Basic info (30%)
  total += 3;
  if (this.username) completed += 1;
  if (this.email) completed += 1;
  if (this.phone) completed += 1;
  
  // Academic info (30%)
  total += 3;
  if (this.program) completed += 1;
  if (this.graduationYear) completed += 1;
  if (this.studentId) completed += 1;
  
  // Driver info (20% if driver)
  if (this.isDriver) {
    total += 2;
    if (this.vehicle.make) completed += 1;
    if (this.vehicle.model) completed += 1;
  }
  
  // Preferences (20%)
  total += 2;
  if (this.ridePreferences.music) completed += 1;
  if (this.ridePreferences.conversation) completed += 1;
  
  this.profileCompletion = Math.round((completed / total) * 100);
  this.profileComplete = this.profileCompletion >= 80;
  return this.profileCompletion;
};

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Calculate profile completion on save
    this.calculateProfileCompletion();
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update rating method
userSchema.methods.updateRating = function(newRating, category) {
  const oldTotal = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (oldTotal + newRating) / this.rating.count;
  
  if (category && this.rating.breakdown[category]) {
    // Update category-specific rating
    this.rating.breakdown[category] = 
      (this.rating.breakdown[category] + newRating) / 2;
  }
};

module.exports = mongoose.model('User', userSchema);