const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/userModel'); 

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: 'http://localhost:8000/auth/callback/google'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user exists
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            // Create new user if not found
            user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                password : 'nopassword'
            });
        }
        // Generate JWT token
        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        done(null, user);
    } catch (err) {
        done(err, false);
    }
}));

// passport.use(new GitHubStrategy({
//     clientID: process.env.GITHUB_ID,
//     clientSecret: process.env.GITHUB_SECRET,
//     callbackURL: 'http://localhost:8000/auth/github/callback'
// }, async (accessToken, refreshToken, profile, done) => {
//     try {
//         // Check if user exists
//         let user = await User.findOne({ githubId: profile.id });
//         if (!user) {
//             // Create new user if not found
//             user = await User.create({
//                 githubId: profile.id,
//                 name: profile.displayName,
//                 email: profile.emails[0].value
//             });
//         }
//         done(null, user);
//     } catch (err) {
//         done(err, false);
//     }
// }));



passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: 'http://localhost:8000/auth/github/callback',
    scope: ['user:email'], // Make sure this scope is included
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if profile.emails exists and has data
        let email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

        if (!email) {
            return done(new Error('No email found on GitHub profile'));
        }

        // Check if user exists
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
            user = await User.create({
                githubId: profile.id,
                name: profile.displayName,
                email: email,
                password : 'nopassword'
            });
        }
        // Generate JWT token
        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        done(null, user);
    } catch (err) {
        done(err, false);
    }
}));

// Serialize and deserialize user for session handling
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
