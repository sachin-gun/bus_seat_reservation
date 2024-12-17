const express = require('express');
const router = express.Router();

// POST: Create a new user (Register)
module.exports = (userServiceModel) => {
    // Route for user registration
    // router.post('/register', async(req, res) => {
    //     const { username, password, role } = req.body;

    //     try {
    //         // Check if the user already exists
    //         const existingUser = await userServiceModel.findOne({ username });
    //         if (existingUser) {
    //             return res.status(400).send('Username already exists');
    //         }

    //         // Create new user
    //         const newUser = new userServiceModel({ username, password, role });
    //         await newUser.save(); // Save to the database
    //         res.status(201).send('User registered successfully');
    //     } catch (err) {
    //         console.error('Error registering user:', err);
    //         res.status(500).send('Error registering user');
    //     }
    // });

    // // POST: Login (Authenticate User)
    // router.post('/login', async(req, res) => {
    //     const { username, password } = req.body;

    //     try {
    //         // Find user by username
    //         const user = await userServiceModel.findOne({ username });
    //         if (!user) {
    //             return res.status(400).send('User not found');
    //         }

    //         // Compare the password with the stored hash
    //         const isMatch = await user.comparePassword(password);
    //         if (!isMatch) {
    //             return res.status(400).send('Incorrect password');
    //         }

    //         res.status(200).send('Login successful');
    //     } catch (err) {
    //         console.error('Error logging in user:', err);
    //         res.status(500).send('Error logging in');
    //     }
    // });

    // GET: Fetch all users
    router.get('/', async(req, res) => {
        try {
            const users = await userServiceModel.find(); // Fetch all users
            res.json(users); // Return users as a JSON response
        } catch (err) {
            console.error('Error fetching users:', err);
            res.status(500).send('Error fetching users');
        }
    });

    return router; // Return the router for use in index.js
};