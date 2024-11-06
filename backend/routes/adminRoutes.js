const express = require("express");
const router = express.Router();
const Admin = require("../models/adminModel");
const authMiddleware = require("../middleware/auth");
const Announcement = require("../models/announcementSchema");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
// Admins are hardcoded , we just need to verify them
// login endpoint (Works)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ msg: "Email and password are required!" });
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
        const token = JWT.sign({ userID: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Send response
        res.status(200).json({
            msg: "Login successful",
            token,
            user: { id: user._id, email: user.email },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// log out endpoint (Works)
router.post("/logout", (req, res) => {
    try {
        // Inform the client to remove the token from storage
        res.status(200).json({
            msg: "Logout successful. Please clear the token on the client side.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// fetch admin courses (Works)
router.get("/fetch", authMiddleware, async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.userID).populate("course");

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({
            courses: admin.course,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching admin data" });
    }
});

//admin posts an announcement (Works)
router.post("/post/assgn", authMiddleware, async (req, res) => {
    try {
        const { title, description, course } = req.body;
        // validate the input
        if (!title || !description || !course) {
            return res
                .status(400)
                .json({ msg: "Title, description, and course are required." });
        }

        // create an annoucement object
        const newannoucement = new Announcement({
            title,
            description,
            course,
            admin: [req.user.userID],
        });

        await newannoucement.save();
        res.status(201).json({
            msg: "Announcement posted successfully",
            announcement: newannoucement,
        });
    } catch (error) {
        res.status(500).json({ msg: "Error posting announcement" });
    }
});

module.exports = router;
