const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/post-images/');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase(); // Normalize extension
        cb(null, uniqueSuffix + ext);
    }
});

// File filter for images only (MIME type and extension check)
const fileFilter = function (req, file, cb) {
    const acceptedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (acceptedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Only JPEG, PNG, GIF, and BMP image files with valid extensions are allowed.'), false);
    }
};

// Initialize multer with storage and file filter
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;