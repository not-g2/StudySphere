const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google authentication
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/callback/google', passport.authenticate('google', {
    successRedirect: '/dashboard', // redirect according to frontend
    failureRedirect: '/login'// redirect according to frontend
}));

// GitHub authentication
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/dashboard',// redirect according to frontend
    failureRedirect: '/login'// redirect according to frontend
}));

// Logout route
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

module.exports = router;
