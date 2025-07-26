const multer = require("multer");

// Use in-memory storage for uploaded files
const storage = multer.memoryStorage();

// Multer upload instance
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // Max: 100MB per file
  },
  fileFilter: (req, file, cb) => {
    // Accept all files; extension/type will be validated later in controller
    cb(null, true);
  },
});

module.exports = upload;
