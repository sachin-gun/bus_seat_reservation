// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../middleware/authMiddleware");
// const Bus = require("../models/Bus");
// const User = require("../models/Users");

// // Add a new bus (Admin or Operator)
// router.post("/", authMiddleware, async(req, res) => {
//     try {
//         // Only Bus Operators or Admin can add a bus
//         const user = await User.findById(req.user.id);
//         if (user.role !== "operator" && user.role !== "admin") {
//             return res.status(403).json({ msg: "Unauthorized" });
//         }

//         const { busName, capacity, route, status } = req.body;
//         const newBus = new Bus({
//             busName,
//             capacity,
//             route,
//             status,
//             busOperator: req.user.id, // Assigning the bus operator
//         });

//         await newBus.save();
//         res.status(201).json(newBus);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Server error");
//     }
// });

// // Update bus details (Only Admin or Bus Operator)
// router.put("/:busId", authMiddleware, async(req, res) => {
//     try {
//         const { busName, capacity, status } = req.body;

//         // Check if bus exists
//         const bus = await Bus.findById(req.params.busId);
//         if (!bus) {
//             return res.status(404).json({ msg: "Bus not found" });
//         }

//         // Only the bus operator or admin can update the bus
//         const user = await User.findById(req.user.id);
//         if (user.role !== "operator" && user.role !== "admin") {
//             return res.status(403).json({ msg: "Unauthorized" });
//         }

//         // Update the bus details
//         bus.busName = busName || bus.busName;
//         bus.capacity = capacity || bus.capacity;
//         bus.status = status || bus.status;

//         await bus.save();
//         res.json(bus);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Server error");
//     }
// });

// // Delete a bus (Only Admin)
// router.delete("/:busId", authMiddleware, async(req, res) => {
//     try {
//         const bus = await Bus.findById(req.params.busId);
//         if (!bus) {
//             return res.status(404).json({ msg: "Bus not found" });
//         }

//         // Only admin can delete a bus
//         const user = await User.findById(req.user.id);
//         if (user.role !== "admin") {
//             return res.status(403).json({ msg: "Unauthorized" });
//         }

//         await bus.remove();
//         res.json({ msg: "Bus removed" });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Server error");
//     }
// });

// // Change bus status (Only Admin or Operator)
// router.put("/status/:busId", authMiddleware, async(req, res) => {
//     try {
//         const bus = await Bus.findById(req.params.busId);
//         if (!bus) {
//             return res.status(404).json({ msg: "Bus not found" });
//         }

//         const { status } = req.body;

//         // Only admin or operator can change the bus status
//         const user = await User.findById(req.user.id);
//         if (user.role !== "operator" && user.role !== "admin") {
//             return res.status(403).json({ msg: "Unauthorized" });
//         }

//         bus.status = status || bus.status;
//         await bus.save();

//         res.json(bus);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Server error");
//     }
// });

// module.exports = router;
const express = require('express');

// GET all buses from bus_service
module.exports = (busServiceModel) => {
    const router = express.Router();

    router.get('/', async(req, res) => {
        try {
            const buses = await busServiceModel.find(); // Use the busServiceModel passed in
            res.json(buses); // Return buses as a JSON response
        } catch (err) {
            console.error('Error fetching buses:', err);
            res.status(500).send('Error fetching buses');
        }
    });

    return router; // Return the router for use in index.js
};