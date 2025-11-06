const express = require('express');
const User = require('../models/User');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all students (Admin only) - PROTECTED
router.get('/students', requireAdmin, async (req, res) => {
  try {
    const students = await User.find({ isAdmin: false })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
});

// Get statistics (Admin only) - PROTECTED
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ isAdmin: false });
    const drivers = await User.countDocuments({ role: 'driver', isAdmin: false });
    const riders = await User.countDocuments({ role: 'rider', isAdmin: false });
    const both = await User.countDocuments({ role: 'both', isAdmin: false });

    res.json({
      success: true,
      stats: {
        totalStudents,
        drivers,
        riders,
        both,
        driversPercentage: totalStudents > 0 ? Math.round((drivers / totalStudents) * 100) : 0,
        ridersPercentage: totalStudents > 0 ? Math.round((riders / totalStudents) * 100) : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// Get single student by ID (Admin only) - PROTECTED
router.get('/students/:id', requireAdmin, async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    
    if (!student || student.isAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
});

// Delete student (Admin only) - PROTECTED
router.delete('/students/:id', requireAdmin, async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
});

module.exports = router;