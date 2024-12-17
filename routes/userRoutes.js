const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const twilio = require('twilio'); // Twilio for sending OTP
const User = require('../models/Users'); // Assuming you have the User model
const router = express.Router();

// Twilio configuration (Replace with your Twilio credentials)
const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Route for traditional login (username and password) for NTC and Bus Operator
router.post('/login', async(req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check if the role matches (only NTC and Bus Operator can log in this way)
        if (user.role !== 'NTC' && user.role !== 'Bus Operator') {
            return res.status(400).json({ msg: 'Unauthorized role' });
        }

        // Compare password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT token
        const payload = { user: { id: user.id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ msg: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error });
    }
});

// Route for generating and sending OTP to Commuters
router.post('/send-otp', async(req, res) => {
    const { phone } = req.body;

    try {
        // Check if the user exists (Commuter role)
        const user = await User.findOne({ phone, role: 'Commuter' });

        if (!user) {
            return res.status(400).json({ msg: 'User not found or not a Commuter' });
        }

        // Generate OTP
        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

        // Store OTP in the database with expiry time (e.g., 10 minutes)
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60000); // OTP expires in 10 minutes
        await user.save();

        // Send OTP via SMS using Twilio (can be replaced with email logic if needed)
        await twilioClient.messages.create({
            body: `Your OTP is: ${otp}`,
            from: 'YOUR_TWILIO_PHONE_NUMBER', // Replace with your Twilio phone number
            to: phone
        });

        res.status(200).json({ msg: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Error sending OTP', error });
    }
});

// Route for logging in with OTP (for Commuters)
router.post('/otp-login', async(req, res) => {
    const { phone, otp } = req.body;

    try {
        // Find user based on phone number (Commuter role)
        const user = await User.findOne({ phone, role: 'Commuter' });

        if (!user) {
            return res.status(400).json({ msg: 'User not found or not a Commuter' });
        }

        // Check if OTP is valid
        if (user.otp !== otp) {
            return res.status(400).json({ msg: 'Invalid OTP' });
        }

        // Check if OTP has expired
        if (new Date() > user.otpExpiry) {
            return res.status(400).json({ msg: 'OTP expired, please request a new one' });
        }

        // Update the last login time
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({ msg: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ msg: 'Error logging in with OTP', error });
    }
});

module.exports = router; // Export the router to be used in server.js