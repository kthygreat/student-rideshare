// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {

    const conn = await mongoose.connect("mongodb+srv://mugishakelvin75_db_userQYN0TUBreityXc2k:@cluster0.wrrg7ec.mongodb.net/your_database_name?retryWrites=true&w=majority&appName=Cluster0");
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;