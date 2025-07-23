const multer = require("multer");
const path = require("path");
const generateCode = require("../utils/generateCode");

// ✅ Define storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // file extension
    const baseName = path.basename(file.originalname, ext); // filename without extension
    const safeBaseName = baseName.replace(/\s+/g, "_").toLowerCase(); // remove spaces, lowercase
    const code = generateCode(12); // random code (like a hash)

    const uniqueName = `${Date.now()}-${safeBaseName}-${code}${ext}`;
    cb(null, uniqueName);
  },
});

// ✅ Set up multer upload
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".jpg", ".jpeg", ".png", ".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error("Only .jpg, .jpeg, .png, and .pdf files are allowed"),
        false
      );
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;
