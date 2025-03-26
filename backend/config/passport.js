const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: "http://localhost:8000/auth/callback/google",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user exists
                let user = await User.findOne({
                    email: profile.emails[0].value,
                });
                if (!user) {
                    // Create new user if not found
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: "nopassword",
                        prevLoginDate : new Date(new Date().setUTCHours(0,0,0,0)),
                        streakCount : 1,
                    });
                } else {
                    // Add googleId to existing user
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        await user.save();
                    }
                    const currDate = new Date(new Date().setUTCHours(0,0,0,0));
                    if(currDate.getTime() - user.prevLoginDate.getTime() === 86400000){
                        // the user logged in on the next day
                        // increase the streak count
                        user.prevLoginDate = currDate;
                        user.streakCount++;
                    }
                    else if(currDate.getTime() > user.prevLoginDate.getTime()+86400000){
                        // user did not log in the last day
                        // reset the streak count
                        user.prevLoginDate = currDate;
                        user.streakCount = 1;
                    }
                    user.auraPoints++;
                    user.xp++;

                    // calculate next level threshold
                    const nextLevelPoints = 100 * (user.level + 1) ** 2;
                    // Check if user qualifies for a level up
                    if (user.xp >= nextLevelPoints) {
                        user.level += 1; // Level up
                        console.log(`Congratulations! ${user.name} reached Level ${user.level}`);
                    }
                    await user.save();    
                }
                // Generate JWT token
                const token = jwt.sign(
                    { userID: user._id },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1h",
                    }
                );
                done(null, user);
            } catch (err) {
                done(err, false);
            }
        }
    )
);

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            callbackURL: "http://localhost:8000/auth/github/callback",
            scope: ["user:email"], // Make sure this scope is included
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if profile.emails exists and has data
                let email =
                    profile.emails && profile.emails.length > 0
                        ? profile.emails[0].value
                        : null;

                if (!email) {
                    return done(new Error("No email found on GitHub profile"));
                }

                // Check if user exists
                let user = await User.findOne({ email: email });
                if (!user) {
                    user = await User.create({
                        githubId: profile.id,
                        name: profile.displayName,
                        email: email,
                        password: "nopassword",
                        prevLoginDate : new Date(new Date().setUTCHours(0,0,0,0)),
                        streakCount : 1
                    });
                } else {
                    if (!user.githubId) {
                        user.githubId = profile.id;
                        await user.save();
                    }
                    const currDate = new Date(new Date().setUTCHours(0,0,0,0));
                    if(currDate.getTime() - user.prevLoginDate.getTime() === 86400000){
                        // the user logged in on the next day
                        // increase the streak count
                        user.prevLoginDate = currDate;
                        user.streakCount++;
                    }
                    else if(currDate.getTime() > user.prevLoginDate.getTime()+86400000){
                        // user did not log in the last day
                        // reset the streak count
                        user.prevLoginDate = currDate;
                        user.streakCount = 1;
                    }

                    user.auraPoints++;
                    user.xp++;

                    // calculate next level threshold
                    const nextLevelPoints = 100 * (user.level + 1) ** 2;
                    // Check if user qualifies for a level up
                    if (user.xp >= nextLevelPoints) {
                        user.level += 1; // Level up
                        console.log(`Congratulations! ${user.name} reached Level ${user.level}`);
                    }
                    await user.save();
                }
                // Generate JWT token
                const token = jwt.sign(
                    { userID: user._id },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1h",
                    }
                );
                done(null, user);
            } catch (err) {
                done(err, false);
            }
        }
    )
);

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
