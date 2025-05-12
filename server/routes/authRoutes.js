const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');
require('../config/passport');

const router = express.Router();


const validateRequestBody = (fields, body) => {
    for (const field of fields) {
        if (!body[field]) {
            return `${field} is required`;
        }
    }
    return null;
};


router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;


        const validationError = validateRequestBody(['name', 'email', 'password'], req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: 'User registered successfully',
            user,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;


        const validationError = validateRequestBody(['email', 'password'], req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }


        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT_SECRET is not defined in environment variables' });
        }


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/forgot-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const validationError = validateRequestBody(['email', 'newPassword'], req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// This route must match exactly what's configured in Google Cloud Console
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),
    (req, res) => {
        // Generate JWT token
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Redirect to client with token
        res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}&userId=${req.user._id}`);
    }
);

// Endpoint to check if a user exists with a given email (for Google login)
router.post('/check-email', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.json({ exists: true, hasGoogleId: !!user.googleId });
        }

        return res.json({ exists: false });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Handle Google login with ID token
router.post('/google-login', async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ message: 'Google credential is required' });
        }

        // Verify the Google ID token
        const { OAuth2Client } = require('google-auth-library');
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Check if user exists
        let user = await User.findOne({ googleId });

        if (!user) {
            // Check if user exists with the same email
            user = await User.findOne({ email });

            if (user) {
                // Update existing user with Google info
                user.googleId = googleId;
                user.profilePicture = picture;
                await user.save();
            } else {
                // Create new user
                user = await User.create({
                    name,
                    email,
                    googleId,
                    profilePicture: picture
                });
            }
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (err) {
        console.error('Google login error:', err);
        res.status(500).json({ error: err.message || 'Google authentication failed' });
    }
});

module.exports = router;