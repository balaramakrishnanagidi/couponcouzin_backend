// const UserRoute = require('./app/routers/user');
// const cors = require('cors');
// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// const https = require('https');
// const fs = require('fs');
// app.use(cors());


// app.use('/', UserRoute);

// const dbConfig = require('./config/database.config.js');
// const mongoose = require('mongoose');

// mongoose.connect(dbConfig.url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => {
//     console.log("Database Connected Successfully!!");
 
//     const User = require('./app/models/adminlogin');
//     const defaultUserData = {
//         email: 'couponcouzin@gmail.com',
//         password: '12345',
//     };
//     User.findOne({ email: defaultUserData.email })
//         .then(user => {
//             if (!user) {
//                 return User.create(defaultUserData);
//             }
//         })
//         .then(() => {
//             console.log('Default user data inserted successfully');
//         })
//         .catch((error) => {
//             console.error('Error inserting default user data:', error);
//             process.exit(1);
//         });
// })
// .catch(err => {
//     console.log('Could not connect to the database', err);
//     process.exit(1);
// });

// app.get('/', (req, res) => {
//     res.json({ "message": "Hello couponcouzin" });
// });

// const options = {
//     key: fs.readFileSync('couponcouzin.com.key'),  
//     cert: fs.readFileSync('b64d6007ddd45bdf.crt'),  
// };

// https.createServer(options, app).listen(2023, () => {
//     console.log("Server is listening on port 2023 (HTTPS)");
// });
const UserRoute = require('./app/routers/user');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

//middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// const http = require('http');
const https = require('https');
const fs = require('fs');
app.use(cors());

//Routes
app.use('/', UserRoute);

//connect to the database
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

// Serve static files from the 'blogs' directory
// app.use('/blogs', express.static(path.join(__dirname, 'app/src/blogs')));

//Serve static files from the 'pulic' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve sitemap.xml
app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

//Default route
app.get('/', (req, res) => {
    res.json({ "message": "Hello couponcouzin" });
});

//https server setup
// const httpServer = http.createServer(app);
const httpsOptions = {
    key: fs.readFileSync('couponcouzin.com.key'),
    cert: fs.readFileSync('b64d6007ddd45bdf.crt'),
};


const httpsServer = https.createServer(httpsOptions, app);


// httpServer.listen(2022, '192.168.0.158', () => {
//     console.log("HTTP Server is listening on port 2022");
// });

httpsServer.listen(2023, '192.168.0.158',() => {
    console.log("HTTPS Server is up and listening on the host 192.168.0.158 in port 2023");
});

// script in package.json
// "test": "echo \"Error: no test specified\" && exit 1"