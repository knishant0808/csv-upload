// Import dependencies
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const FileMetadata = require('../models/fileMetadata');

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
            } else {
                if (req.file == undefined) {
                    return res.status(400).json({ error: 'No file selected!' });
                } else {
                    const originalFileName = req.file.originalname;
                    const filePath = req.file.path.replace('server', 'server/uploads');
                    const fileName = await getUniqueFileName(filePath, originalFileName);

                    const fileMetadata = new FileMetadata({
                        fileName: originalFileName,
                        fileSize: req.file.size,
                        fileAddress: filePath.replace(originalFileName, fileName)
                    });

                    await fileMetadata.save();

                    return res.status(200).json({ message: 'File uploaded successfully!' });
                }
            }
        });

        async function getUniqueFileName(filePath, originalFileName) {
            let fileName = originalFileName;
            let count = 1;
            const extension = path.extname(originalFileName);
            const baseName = path.basename(originalFileName, extension);
        
            // Check both file system and database for existing file
            while (await fileExists(filePath) || await FileMetadata.findOne({ fileName }).exec()) {
                fileName = `${baseName} (${count})${extension}`;
                filePath = path.join(path.dirname(filePath), fileName);
                count++;
            }
        
            return fileName;
        }

        async function fileExists(filePath) {
            try {
                await fs.access(filePath, fs.constants.F_OK);
                return true;
            } catch {
                return false;
            }
        };
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error!' });
    }
};

module.exports = { uploadFile };
