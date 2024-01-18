// Import the express module to create a router instance
const express = require('express');
// Initialize the express router
const router = express.Router();

// Import the fileController module which contains the logic for file operations
// This controller will handle requests related to file operations
const fileController = require('../controllers/fileController');

// Define a POST route for '/file/upload'
// This route will handle the file upload functionality
// The uploadFile method from fileController will process the upload request
router.post('/upload', fileController.uploadFile);

// Define a GET route for '/file/view/:fileId'
// This route will handle requests to view a specific file
// The viewFile method in fileController will process the request
// ':fileId' is a route parameter representing the unique ID of the file
router.get('/view/:fileId', fileController.viewFile);

// Export the router so it can be used in other parts of the application
module.exports = router;
