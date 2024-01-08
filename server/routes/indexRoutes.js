const express = require('express')
const router = express.Router();

const fileRoutes = require('./fileRoutes');

const FileMetadata = require('../models/fileMetadata');

// Route: /
router.get('/', async (req, res) => {
    try {
        const fileMetadata = await FileMetadata.find().exec();
        res.render('allFiles', { fileMetadata });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Route: /file
router.use('/file', fileRoutes);

module.exports = router;
