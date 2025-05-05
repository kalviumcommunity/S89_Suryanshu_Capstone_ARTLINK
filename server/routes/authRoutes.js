const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

module.exports = router;