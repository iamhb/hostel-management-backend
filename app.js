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
    origin: 'http://localhost:3000',
    credentials: true,            
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Hello");
});


app.use('/api/customers', rCustomer);
app.use('/api/staff', rStaff);

app.listen(PORT, () => {
    console.log("Server started at", PORT);
});




// Save users
app.post('/register', async (req, res) => {
    console.log("secret key", process.env.JWT_SECRET);

    const { name, email, password, confirmPassword, gender, role } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            gender,
            role: role || 'user', // Default role is 'user'
        });

        await newUser.save();

        const token = generateToken(newUser._id, newUser.role);

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Login api

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id, user.role);
        let userRole = user.role;
        res.status(200).json({ message: 'Login successful', token, userRole });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});
