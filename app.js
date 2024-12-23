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

app.listen(PORT, () => {
    console.log("Server started at", PORT);
});