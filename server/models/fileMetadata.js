// Import the mongoose module to create a schema and model
const mongoose = require('mongoose');

// Define the schema for file metadata
// This schema will be used to store information about files uploaded to the server
const fileMetadataSchema = new mongoose.Schema({
    // fileName: Stores the name of the file. It's a required field of type String.
    fileName: {
        type: String,
        required: true
    },
    // fileSize: Stores the size of the file in bytes. It's a required field of type Number.
    fileSize: {
        type: Number,
        required: true
    },
    // uploadDate: Stores the date and time when the file was uploaded.
    // By default, it will be set to the current date and time when the file metadata is created.
    uploadDate: {
        type: Date,
        default: Date.now
    },
    // fileAddress: Stores the file path or address where the file is stored on the server.
    // It's a required field of type String.
    fileAddress: {
        type: String,
        required: true
    }
    // You can add more fields to this schema as per your requirements.
    // For example, you might want to store the file type, the user who uploaded the file, etc.
});

// Create a Mongoose model from the schema
// The model will be used to create and manage documents in the database that follow the defined schema
const FileMetadata = mongoose.model('FileMetadata', fileMetadataSchema);

// Export the model so it can be imported and used in other parts of the application
module.exports = FileMetadata;
