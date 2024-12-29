const express = require('express');
const app = new express();
const cors = require('cors');
const PORT = 3000;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// mongoose.set('strictQuery', false);
// const dbUrl = "mongodb+srv://jojopaydbadmin:jojojojo@jojopaycluster.ecc2zb8.mongodb.net/jojopays";
// const dbUrl = "mongodb://localhost:27017/hostel";
const DB_CONNECTION_STRING = "mongodb+srv://nexus_admin:ITHANDAPASSWORD@nexus-dev-cluster.tyd0o.mongodb.net/hotel-management?retryWrites=true&w=majority&appName=Nexus-Dev-Cluster";

app.use(express.json());


const rCustomer = require('./src/routes/rCustomer');
const rStaff = require('./src/routes/rStaff');
const rRoom = require('./src/routes/rRoom');
const rRequestMaintenance = require('./src/routes/rRequestMaintenance');
const rRoomAllocation = require('./src/routes/rRoomAllocation');
const mStaff = require('./src/models/mStaff');
const rDashboard = require('./src/routes/rDashboard');

mongoose
    .connect(DB_CONNECTION_STRING)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });
// Hostal-managment localhost:27017 [direct]
// const cluster = require('cluster');
// const logRequestResponse = require('./middlewares/logger');
// const verifyToken = require('./middlewares/tokenMiddleware');
// const User = require('./src/models/mUser');
// const { generateToken } = require('./src/auth/jwtUtils');

// app.use(cors());
const corsOptions = {
    origin: 'http://localhost:3001',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Hello");
});

app.use('/api/customers', rCustomer);
app.use('/api/staff', rStaff);
app.use('/api/room', rRoom);
app.use('/api/maintenance', rRequestMaintenance);
app.use('/api/roomAllocation', rRoomAllocation);
app.use('/api/dashboard',rDashboard);



// Login

// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ message: 'Email and password are required.' });
//     }

//     try {
//         // Find the staff by email
//         const staff = await mStaff.findOne({ email });

//         if (!staff) {
//             return res.status(404).json({ message: 'Staff not found.' });
//         }

//         // Compare the provided password with the stored password
//         // const isMatch = await bcrypt.compare(password, staff.password);
//         const isMatch = password === staff.password;

//         if (!isMatch) {
//             return res.status(401).json({ message: 'Invalid credentials.' });
//         }

//         // Set the cookie with user information (name, role) for session management
//         const userData = { name: staff.name, role: staff.Role };
//         res.cookie('user', JSON.stringify(userData), {
//             httpOnly: true, // Prevents client-side JS from accessing the cookie
//             // secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
//             maxAge: 86400000, // Cookie expires after 1 day
//             sameSite: 'strict', // Restrict the cookie to the same site
//         });

//         // Return response without sensitive data (like password)
//         res.status(200).json({ message: 'Login successful' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error.' });
//     }
// });
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log({ email, password });


    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Find the staff by email
        const staff = await mStaff.findOne({ email });
        console.log("staff", staff);


        if (!staff) {
            return res.status(404).json({ message: 'Staff not found.' });
        }

        // Compare the provided password with the stored password
        // const isMatch = await bcrypt.compare(password, staff.password);
        const isMatch = password === staff.password;

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Return the name and role if credentials are valid
        res.status(200).json({
            name: staff.name,
            staffId: staff._id,
            role: staff.Role,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.listen(PORT, () => {
    console.log("Server started at", PORT);
});