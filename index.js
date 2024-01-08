const express = require('express');    // Import express  
const path = require('path');           // Import path
const bodyParser = require('body-parser'); //Import body parser
const connectDB = require('./server/config/db'); // Import the database connection function

// Import indexRoutes
const indexRoutes = require('./server/routes/indexRoutes');

// Create a new express application
const app = express();

// Connect to the database
connectDB();

// Set the views directory and view engine for the express application
app.set('views', path.join(__dirname, './client/views'));
app.set('view engine', 'ejs');

// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, 'client')));

// Use the body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use the router for all '/' routes
app.use('/', indexRoutes);

// Define the port the server will listen on
const port = 5100;

// Start the server and log a message to the console
app.listen(port, () => console.log(`Server running on port ${port}`));
