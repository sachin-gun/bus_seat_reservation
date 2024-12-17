// const express = require("express");
// const connectDB = require("./config/db");
// const dotenv = require("dotenv");
// const authRoutes = require("./routes/authRoutes");
// const busRoutes = require("./routes/busRoutes");

// dotenv.config();
// connectDB();

// const app = express();

// // Middleware to parse JSON body
// app.use(express.json());

// // Auth routes
// app.use("/api/auth", authRoutes);
// // Bus routes
// app.use("/api/bus", busRoutes);

// const PORT = process.env.PORT || 5001;

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: './.env/.env' });; // Import dotenv to load environment variables
const busRoutes = require('./routes/busRoutes'); // Import bus routes
const userRoutes = require('./routes/userRoutes'); // Import user routes

// Load environment variables from .env file
dotenv.config();


console.log('Mongo URI:', process.env.MONGO_URI);

const app = express();
const port = process.env.PORT || 8080; // Use port from .env, default to 8080 if not set

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection URI from .env
const uri = process.env.MONGO_URI; // Mongo URI from .env

// Create connection to MongoDB
const createConnection = async() => {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
    }
};

createConnection();

// Access user_service database for user routes
const userServiceDb = mongoose.connection.useDb('user_service'); // Specify the user_service database
const userServiceModel = userServiceDb.model('users', new mongoose.Schema({
    username: String,
    password: String,
    role: { type: String, enum: ['NTC', 'Bus Operator', 'Commuter'], required: true }
}));

// Access bus_service database for bus routes
const busServiceDb = mongoose.connection.useDb('bus_service'); // Specify the bus_service database
const busServiceModel = busServiceDb.model('buses', new mongoose.Schema({
    licensePlate: String,
    capacity: Number
}));

// Use busRoutes for all /api routes
app.use('/api/buses', busRoutes(busServiceModel)); // Pass the model to busRoutes
app.use('/api/users', userRoutes(userServiceModel)); // Pass the model to userRoutes

app.get('/', (req, res) => {
    res.send('Bus Seat Reservation ');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});