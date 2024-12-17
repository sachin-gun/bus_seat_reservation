// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const dotenv = require('dotenv');
// dotenv.config({ path: './.env/.env' });
// const userRoutes = require('./routes/userRoutes');
// const busRoutes = require('./routes/busRoutes'); // Add bus routes as needed
// const authMiddleware = require('./middleware/authMiddleware');

// dotenv.config();
// const app = express();
// const port = process.env.PORT || 8080;

// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB connection URI
// const uri = process.env.MONGO_URI;
// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch((err) => console.log('Error connecting to MongoDB:', err));

// // Pass User model to routes
// const userServiceDb = mongoose.connection.useDb('user_service');
// const userServiceModel = userServiceDb.model('users', new mongoose.Schema({
//     username: String,
//     password: String,
//     role: { type: String, enum: ['NTC', 'Bus Operator', 'Commuter'], required: true }
// }));

// // Use routes for user authentication and OTP login
// app.use('/api/users', userRoutes(userServiceModel));

// // Use routes for bus management (protected)
// app.use('/api/buses', authMiddleware, busRoutes(busServiceModel));

// app.get('/', (req, res) => {
//     res.send('Bus Seat Reservation API');
// });

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: './.env/.env' }); // Load the .env file from the folder

const userRoutes = require('./routes/userRoutes'); // Import user routes
const busRoutes = require('./routes/busRoutes'); // Import bus routes (if needed)
const authMiddleware = require('./middleware/authMiddleware'); // JWT middleware

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json()); // Middleware to parse JSON requests

// MongoDB connection URI
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

// Use the user routes (this will add the login functionality under /api/users)
app.use('/api/users', userRoutes); // Just use userRoutes directly

// Use the bus routes (this will handle the bus-related API, protected by JWT)
app.use('/api/buses', authMiddleware, busRoutes);

app.get('/', (req, res) => {
    res.send('Bus Seat Reservation API');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});