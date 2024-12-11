const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const busRoutes = require("./routes/busRoutes");

dotenv.config();
connectDB();

const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);
// Bus routes
app.use("/api/bus", busRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});