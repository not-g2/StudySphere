const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Google authentication
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
router.get('/auth/callback/google', passport.authenticate('google', { session: false }), (req, res) => {
    // Generate JWT token after successful authentication
    const token = jwt.sign({ userID: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Send the token in the response
    res.status(200).json({ token });
});

// GitHub authentication
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub callback route
router.get('/auth/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
    // Generate JWT token after successful authentication
    const token = jwt.sign({ userID: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Send the token in the response
    res.status(200).json({ token });
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

module.exports = router;
