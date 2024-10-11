// Importing necessary modules
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Importing route modules
const userRoute = require('./routes/user.route');
const adminRoute = require('./routes/admin.route');
const order = require('./routes/order');

// Load environment variables from the .env file
dotenv.config();

// Creating an Express application
const app = express();

// Setting the port for the server to run on
const PORT = process.env.PORT || 3000;

// Connect to MongoDB using the provided URI in the environment variables
mongoose.connect(process.env.MONGODB_URI, {});

// Setting up middleware
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Parsing URL-encoded bodies
app.use(express.json()); // Parsing JSON bodies
app.use(
    session({
        secret: process.env.SESSION_SECRET, // Secret used to sign the session ID cookie
        resave: true,
        saveUninitialized: true,
    })
);

// Serving static files from the 'public' directory
app.use(express.static('public'));

// Setting up the view engine (EJS in this case)
app.set('view engine', 'ejs');
app.set('views', 'views');

// Setting up routes
app.use(userRoute); // Using the user routes
app.use(adminRoute); // Using the admin routes
app.use('/order', order);

// Starting the server and listening on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});