const express = require('express');
const router = express.Router();
const Admin = require('../models/adminModel');
const authMiddleware = require('../middleware/auth');
const Announcement = require('../models/announcementSchema');
const Assignment = require('../models/assignmentSchema');
const {upload} = require('../utils/cloudinary');  // Import upload middleware
// Admins are hardcoded , we just need to verify them
// login endpoint
router.post('/login', async (req , res) => {
    try{
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required!" });
        }

        // Find user by email
        const user = await Admin.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: "Invalid credentials!" });
        }

        // Compare password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid credentials!" });
        }

        // Generate JWT token
        const token = JWT.sign(
            { userID: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send response
        res.status(200).json({
            msg: "Login successful",
            token,
            user: { id: user._id, email: user.email }
        });
    }catch(error){
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// log out endpoint
router.post('/logout', (req, res) => {
    try {
        // Inform the client to remove the token from storage
        res.status(200).json({
            msg: "Logout successful. Please clear the token on the client side."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// fetch admin courses
router.get('/fetch',authMiddleware, async (req,res)=>{
    try{
        const admin = await Admin.findById(req.user.userID)
        .populate('course');

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({
            courses : admin.course
        })
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Error fetching admin data" });
    }

});

//admin posts an announcement
router.post('/post/announcement',authMiddleware,async (req , res)=>{
    try{
        const {title , description , course} = req.body;

        // validate the input
        if(!title || !description || !course){
            return res.status(400).json({ msg: "Title, description, and course are required." });
        }

        // create an annoucement object
        const newannoucement = new Announcement({
            title,
            description,
            course,
            admin : [req.user.userID]
        });

        await newannoucement.save();
        res.status(201).json({ msg: "Announcement posted successfully", announcement: newAnnouncement });
    }catch(error){
        res.status(500).json({ msg: "Error posting announcement" });
    }
});

// admin uploads a new assignment
router.post('/post/assgn',authMiddleware,upload.single('pdfFile'),async(req,res)=>{
    try{
        const {title,description,course,dueDate,createdAt,createdBy} = req.body;

        if(!title || !dueDate){
            return res.status(400).json({ message: 'Title and due date are required' });
        }
        
        // Check if PDF file was uploaded
        const pdfLink = req.file ? req.file.path : null;

        // Create a new assignment document
        const newAssignment = new Assignment({
            title,
            description,
            course,
            dueDate,
            createdBy,  
            createdAt,
            pdfLink
        });

        const savedAssignment = await newAssignment.save();
        res.status(201).json({ message: 'Assignment created successfully', assignment: savedAssignment });
    }catch(error){
        res.status(201).json({ message: 'Assignment created successfully', assignment: savedAssignment });
    }
});

router.get('/fetchassgn',authMiddleware,async(req,res)=>{
    
});
module.exports = router;