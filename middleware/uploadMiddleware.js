const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = req.uploadDir || 'default';
    const fullPath = path.join(__dirname, `../uploads/${uploadDir}/`);

    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// File filter to allow specific types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && ['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, GIF, and BMP image files are allowed.'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;