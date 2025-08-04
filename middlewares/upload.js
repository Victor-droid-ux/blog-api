const multer = require("multer");
const path = require("path");
const generateCode = require("../utils/generateCode");

// Use in-memory storage for uploaded files
const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const originalName = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    const filename = originalName.replace(/\s/g, "_"); // Replace spaces with underscores
    const compressedFilename =
      filename + "-compressed" + path.extname(file.originalname);

    const toLowerCase = compressedFilename.toLowerCase(); // Convert to lowercase
    const generatedCode = generateCode(12); // Generate a random code
    const finalFilename = `${toLowerCase}-${generatedCode}${path.extname(
      file.originalname
    )}`;
    cb(null, finalFilename);
  },
});

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
