const UserRoute = require('./app/routers/user');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const http = require('http'); // Make sure to include this
const https = require('https');
const fs = require('fs');
app.use(cors());

// Routes
app.use('/', UserRoute);

// Connect to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Database Connected Successfully!!");

    const User = require('./app/models/adminlogin');
    const defaultUserData = {
        email: 'couponcouzin.com',
        password: '121212',
    };

    User.findOne({ email: defaultUserData.email })
        .then(user => {
            if (!user) {
                return User.create(defaultUserData);
            }
        })
        .then(() => {
            console.log('Default user data inserted successfully');
        })
        .catch((error) => {
            console.error('Error inserting default user data:', error);
            process.exit(1);
        });
})
.catch(err => {
    console.log('Could not connect to the database', err);
    process.exit(1);
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Default route
app.get('/', (req, res) => {
    res.json({ "message": "Hello couponcouzin" });
});

// HTTPS server setup
const httpsOptions = {
    key: fs.readFileSync('couponcouzin.com.key'),
    cert: fs.readFileSync('b64d6007ddd45bdf.crt'),
};

const httpsServer = https.createServer(httpsOptions, app);

// HTTP server setup
const httpServer = http.createServer(app); // Declare the HTTP server here

httpServer.listen(2022, '192.168.0.112', () => {
    console.log("HTTP Server is listening on port 2022");
});

// Uncomment this line to start the HTTPS server
// httpsServer.listen(2023, '192.168.0.158', () => {
//     console.log("HTTPS Server is up and listening on the host 192.168.0.158 in port 2023");
// });

// script in package.json
// "test": "echo \"Error: no test specified\" && exit 1"
