const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:5000/api/auth/google/callback',
            scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists in our database
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    // User exists, return the user
                    return done(null, user);
                }

                // Check if user exists with the same email
                user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    // User exists with email but not linked to Google, update the user
                    user.googleId = profile.id;
                    user.profilePicture = profile.photos[0].value;
                    await user.save();
                    return done(null, user);
                }

                // Create a new user
                const newUser = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    profilePicture: profile.photos[0].value,
                });

                return done(null, newUser);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

module.exports = passport;
