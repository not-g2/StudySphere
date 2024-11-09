const express = require('express');
const router = express.Router();
const Timetable = require('../models/timeTableSchema'); // Timetable model
const User = require('../models/userModel'); // User model (assuming 'User' is the model for students)

// Route to populate a student's timetable
router.post('/timetable', async (req, res) => {
  try {
    const { studentId, timetable } = req.body;

    // Validate if the student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if timetable already exists for the student
    let existingTimetable = await Timetable.findOne({ student: studentId });
    if (existingTimetable) {
      // If the timetable exists, update it
      existingTimetable.timetable = timetable;
      await existingTimetable.save();
      return res.status(200).json({ message: 'Timetable updated successfully' });
    }

    // Create a new timetable if it doesn't exist
    const newTimetable = new Timetable({
      student: studentId,
      timetable
    });

    await newTimetable.save();
    res.status(201).json({ message: 'Timetable saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving timetable', error });
  }
});

// Route to fetch timetable for a student
router.get('/timetable/:studentId', async (req, res) => {
    try {
      const { studentId } = req.params;
  
      // Fetch the timetable for the student and populate student details
      const timetable = await Timetable.findOne({ student: studentId }).populate('student', 'name email');
  
      if (!timetable) {
        return res.status(404).json({ message: 'Timetable not found for this student' });
      }
  
      res.status(200).json({
        student: timetable.student,
        timetable: timetable.timetable
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching timetable', error });
    }
});
  

  
module.exports = router;
