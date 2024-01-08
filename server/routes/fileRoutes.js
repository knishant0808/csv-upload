const express = require('express');
const router = express.Router();
// Import the filecontroller   
const fileController = require('../controllers/fileController');

// Route: /file/upload
router.post('/upload', fileController.uploadFile);

// Add more routes for '/file' here

module.exports = router;