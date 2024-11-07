const express = require("express");
const router = express.Router();
const { upload } = require("../utils/cloudinary");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

// signup endpoint
router.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(email);
        // console.log(password);
        // console.log(req);
        if (!email || !password) {
            return res.status(400).json({
                msg: "Email and pasword are required!",
            });
        }

        if (!process.env.JWT_secret) {
            throw new Error("JWT secret is not defined");
        }

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                msg: "User already exists!",
            });
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create and save the user
        const newUser = new User({
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // generate the JWT token
        const token = JWT.sign(
            { userID: newUser._id },
            process.env.JWT_secret,
            { expiresIn: "1h" }
        );

        // send response
        res.status(201).json({
            msg: "User created successfully",
            token,
            user: { id: newUser._id, email: newUser.email, isAdmin: false },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Internal Server Error",
        });
    }
});

// login endpoint
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ msg: "Email and password are required!" });
        }

        // Find user by email
        const user = await User.findOne({ email });
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
            user: { id: user._id, email: user.email, isAdmin: false },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// log out endpoint
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

module.exports = router;
