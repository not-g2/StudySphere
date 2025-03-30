const express = require("express");
const router = express.Router();
const { upload } = require("../utils/cloudinary");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const Badge = require("../models/badgeSchema");
const checkBadgeFromStreak = require("../helperfunction/badgeFromStreak");
const checkBadgeFromLevel = require("../helperfunction/badgeFromLevel");

// signup endpoint
router.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                msg: "Email and pasword are required!",
            });
        }

        if (!process.env.JWT_SECRET) {
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

        const name = email.split("@")[0]; // default name , user can change it later
        // create and save the user
        const newUser = new User({
            name: name,
            email,
            password: hashedPassword,
            prevLoginDate: new Date(new Date().setUTCHours(0, 0, 0, 0)),
            streakCount: 1,
            unlockedBadges: ["67e407a602cd398c11be6875"],
        });

        await newUser.save();

        // generate the JWT token
        const token = JWT.sign(
            { userID: newUser._id },
            process.env.JWT_SECRET,
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
        // if no user is found with the given email , then the user variable will have "null" value
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

        let badgeImages = [];

        const currDate = new Date(new Date().setUTCHours(0, 0, 0, 0));
        if (currDate.getTime() - user.prevLoginDate.getTime() === 86400000) {
            // the user logged in on the next day
            // increase the streak count
            user.prevLoginDate = currDate;
            user.streakCount++;
            user.auraPoints++;
            user.xp++;

            const badgeId = checkBadgeFromStreak(user.streakCount);
            if (badgeId) {
                let len1 = user.unlockedBadges.length;
                user.unlockedBadges = [
                    ...new Set([...user.unlockedBadges, badgeId]),
                ];
                let len2 = user.unlockedBadges.length;
                if (len1 !== len2) {
                    const streakBadge = await Badge.findById(badgeId).select(
                        "badgeLink"
                    );
                    badgeImages.push(streakBadge);
                }
            }

            // calculate next level threshold
            const nextLevelPoints = 100 * (user.level + 1) ** 2;
            // Check if user qualifies for a level up
            if (user.xp >= nextLevelPoints) {
                user.level += 1; // Level up
                const badgeIdFromLevel = checkBadgeFromLevel(user.level);
                if (badgeIdFromLevel) {
                    let len1 = user.unlockedBadges.length;
                    user.unlockedBadges = [
                        ...new Set([...user.unlockedBadges, badgeIdFromLevel]),
                    ];
                    let len2 = user.unlockedBadges.length;
                    if (len1 !== len2) {
                        const levelBadge = await Badge.findById(
                            badgeIdFromLevel
                        ).select("badgeLink");
                        badgeImages.push(levelBadge);
                    }
                }
                console.log(
                    `Congratulations! ${user.name} reached Level ${user.level}`
                );
            }

            await user.save();
        } else if (
            currDate.getTime() >
            user.prevLoginDate.getTime() + 86400000
        ) {
            // user did not log in the last day
            // reset the streak count
            user.prevLoginDate = currDate;
            user.streakCount = 1;
            user.auraPoints++;
            user.xp++;

            // const badgeId = checkBadgeFromStreak(user.streakCount);
            // if (badgeId) {
            //     user.unlockedBadges = [...new Set([...user.unlockedBadges, badgeId])];
            // }

            // calculate next level threshold
            const nextLevelPoints = 100 * (user.level + 1) ** 2;
            // Check if user qualifies for a level up
            if (user.xp >= nextLevelPoints) {
                user.level += 1; // Level up
                const badgeIdFromLevel = checkBadgeFromLevel(user.level);
                if (badgeIdFromLevel) {
                    let len1 = user.unlockedBadges.length;
                    user.unlockedBadges = [
                        ...new Set([...user.unlockedBadges, badgeIdFromLevel]),
                    ];
                    let len2 = user.unlockedBadges.length;
                    if (len1 !== len2) {
                        const levelBadge = await Badge.findById(
                            badgeIdFromLevel
                        ).select("badgeLink");
                        badgeImages.push(levelBadge);
                    }
                }
                console.log(
                    `Congratulations! ${user.name} reached Level ${user.level}`
                );
            }

            await user.save();
        }
        // Send response
        res.status(200).json({
            msg: "Login successful",
            token,
            badgeImages,
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
