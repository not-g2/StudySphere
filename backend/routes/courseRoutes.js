const express = require('express');
const router = express.Router();
const User = require('../models/userModel');  // Import User model
const authMiddleware = require('../middleware/auth');  // Middleware to authenticate users
const Course = require('../models/courseModel');

router.post('/create',authMiddleware , async (req , res) => {
    
    const {name, description, students } = req.body;
    try{
        const course = new Course({
            name,
            description,
            students
        });
        await course.save();
        res.status(201).json({ message: 'Course created successfully', course });
    }

    catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
})

module.exports = router;