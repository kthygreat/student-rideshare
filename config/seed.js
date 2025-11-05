const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const sampleUsers = [
  {
    username: 'admin_user',
    email: 'admin@college.com',
    password: 'admin123',
    studentId: 'ADMIN001',
    program: 'Administration',
    graduationYear: 2025,
    role: 'rider',
    isAdmin: true
  },
  {
    username: 'john_driver',
    email: 'john.doe@college.com',
    password: 'password123',
    studentId: 'S12345',
    program: 'Computer Science',
    graduationYear: 2024,
    role: 'driver',
    carDetails: {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      color: 'Blue',
      licensePlate: 'ABC123'
    }
  },
  {
    username: 'jane_rider',
    email: 'jane.smith@college.com',
    password: 'password123',
    studentId: 'S67890',
    program: 'Business Administration',
    graduationYear: 2024,
    role: 'rider'
  },
  {
    username: 'mike_both',
    email: 'mike.jones@college.com',
    password: 'password123',
    studentId: 'S13579',
    program: 'Engineering',
    graduationYear: 2024,
    role: 'both',
    carDetails: {
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      color: 'Red',
      licensePlate: 'XYZ789'
    }
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users (optional - be careful in production!)
    await User.deleteMany({});
    console.log('✅ Cleared existing users');

    // Hash passwords and create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.username} (${user.role})`);
    }

    // Display summary
    console.log('\n📊 Database Seeding Summary:');
    console.log(`Total users created: ${createdUsers.length}`);
    console.log(`Admins: ${createdUsers.filter(u => u.isAdmin).length}`);
    console.log(`Drivers: ${createdUsers.filter(u => u.role === 'driver').length}`);
    console.log(`Riders: ${createdUsers.filter(u => u.role === 'rider').length}`);
    console.log(`Both: ${createdUsers.filter(u => u.role === 'both').length}`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n🔑 Admin Login Credentials:');
    console.log('Email: admin@college.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;