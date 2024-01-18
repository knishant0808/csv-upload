// Import required modules
const fs = require('fs'); // File System module to handle file operations
const multer = require('multer'); // Multer for handling multipart/form-data (file uploads)
const path = require('path'); // Path module to handle file paths
const FileMetadata = require('../models/fileMetadata'); // Mongoose model for file metadata
const csvParser = require('csv-parser'); // CSV parser to parse CSV files

// Configure the storage engine for multer (file upload middleware)
const storage = multer.diskStorage({
    // Destination folder for uploaded files
    destination: './server/uploads',
    // Naming convention for uploaded files
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer with the defined storage engine and file filter
const upload = multer({
    storage: storage,
    // File filter function to restrict file types
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('csvFile'); // Specify that it will handle single file uploads with the field name 'csvFile'

// Function to check the file type (to allow only CSV files)
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

// Controller function to handle file uploading and saving file metadata
const uploadFile = async (req, res) => {
    try {
        // Use multer to upload the file
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            if (req.file == undefined) {
                return res.status(400).json({ error: 'No file selected!' });
            }

            const originalFileName = req.file.originalname;

            // Check if file already exists in the database
            const existsInDb = await FileMetadata.findOne({ fileName: originalFileName }).exec();
            if (existsInDb) {
                return res.status(400).json({ error: 'File already exists in database!' });
            }

            // File path adjustment (if needed)
            const filePath = req.file.path.replace('server', 'server');

            // Create new file metadata instance
            const fileMetadata = new FileMetadata({
                fileName: originalFileName,
                fileSize: req.file.size,
                fileAddress: filePath
            });

            // Save the file metadata to the database
            await fileMetadata.save();

            return res.status(200).json({ message: 'File uploaded successfully!' });
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error!' });
    }
};

// Controller function to view a CSV file
const viewFile = async (req, res) => {
    try {
        // Extract the file ID from request parameters
        const fileId = req.params.fileId;
        // Pagination settings: default page and number of records per page
        const page = req.query.page || 1;
        const pageSize = 100;

        // Retrieve the file metadata from the database using the file ID
        const fileMetadata = await FileMetadata.findById(fileId).exec();

        if (!fileMetadata) {
            return res.status(404).json({ error: 'File not found!' });
        }

        // File reading and parsing with pagination
        const filePath = fileMetadata.fileAddress;

        // Check if the file exists at the given path
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File does not exist at the specified path!' });
        }

        const fileData = [];
        let counter = 0;

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                if (counter >= (page - 1) * pageSize && counter < page * pageSize) {
                    fileData.push(row);
                }
                counter++;
            })
            .on('end', () => {
                // Calculate total pages for pagination
                const totalPages = Math.ceil(counter / pageSize);

                // Render the CSV data to a view with pagination
                res.render('csvView', { fileData, currentPage: parseInt(page), pageSize, totalPages });
            });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error!' });
    }
};

// Export the controller functions
module.exports = { uploadFile, viewFile };