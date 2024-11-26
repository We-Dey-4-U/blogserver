const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Get the upload directory from req.uploadDir (if it's not set, fallback to 'default')
        const uploadDirType = req.uploadDir || 'default';
        const uploadDir = path.join(__dirname, `../uploads/${uploadDirType}/`);

        // Ensure the directory exists, create if not
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, uniqueSuffix + ext); // Set a unique file name
    }
});

// File filter for allowed image types
const fileFilter = function (req, file, cb) {
    const acceptedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (acceptedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, GIF, and BMP image files are allowed.'), false);
    }
};

// Initialize multer with storage and file filter settings
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;