// Import the express module to create a router instance
const express = require('express');
// Initialize the express router
const router = express.Router();

// Import the fileRoutes module which handles routes related to files
const fileRoutes = require('./fileRoutes');

// Import the FileMetadata model from the models directory
// This model will be used to interact with the file metadata in the database
const FileMetadata = require('../models/fileMetadata');

// Define a GET route for the root URL ('/')
// This route will retrieve all file metadata and display them
router.get('/', async (req, res) => {
    try {
        // Retrieve all file metadata using the FileMetadata model
        const fileMetadata = await FileMetadata.find().exec();
        // Render the 'allFiles' view, passing the retrieved file metadata
        res.render('allFiles', { fileMetadata });
    } catch (err) {
        // Log the error to the console and send a 500 Internal Server Error response
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Define a route handler for any requests to '/file'
// The fileRoutes module will handle these requests
router.use('/file', fileRoutes);

// Export the router so it can be used in other parts of the application
module.exports = router;
