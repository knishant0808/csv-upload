// Import dependencies
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const FileMetadata = require('../models/fileMetadata');
const csvParser = require('csv-parser');

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: './server/uploads',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer upload
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('csvFile');

// Check file type
function checkFileType(file, cb) {
    const filetypes = /csv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Only CSV files are allowed!');
    }
}

// Upload and save file metadata
const uploadFile = async (req, res) => {
    try {
        // Upload file using multer
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err });
            }

            if (req.file == undefined) {
                return res.status(400).json({ error: 'No file selected!' });
            }

            const originalFileName = req.file.originalname;

            // Check if file exists in the database
            const existsInDb = await FileMetadata.findOne({ fileName: originalFileName }).exec();
            if (existsInDb) {
                return res.status(400).json({ error: 'File already exists in database!' });
            }

            // Process and save file to local storage
            const filePath = req.file.path.replace('server', 'server');

            // Create file metadata
            const fileMetadata = new FileMetadata({
                fileName: originalFileName,
                fileSize: req.file.size,
                fileAddress: filePath
            });

            // Save metadata to database
            await fileMetadata.save();

            return res.status(200).json({ message: 'File uploaded successfully!' });
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error!' });
    }
};

// Function to view a CSV file
const viewFile = async (req, res) => {
    try {
        // Get the fileId from the request parameters
        const fileId = req.params.fileId;

        // Find the file metadata by fileId
        const fileMetadata = await FileMetadata.findById(fileId).exec();

        if (!fileMetadata) {
            return res.status(404).json({ error: 'File not found!' });
        }

        // Read and parse the CSV file
        const filePath = fileMetadata.fileAddress;
        const fileData = [];
        
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                fileData.push(row);
            })
            .on('end', () => {
                // Render the CSV data in a view (e.g., using a template engine like EJS)
                res.render('csvView', { fileData }); // Modify the template engine and view as needed
            });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error!' });
    }
};


module.exports = { uploadFile, viewFile };
