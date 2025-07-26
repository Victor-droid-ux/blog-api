const multer = require("multer");

// ✅ Allowed MIME types
const allowedMimetypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
  "audio/mpeg", // .mp3
  "audio/wav", // .wav
  "audio/mp4", // .m4a or .mp4 audio
  "video/mp4", // .mp4
  "video/mpeg", // .mpeg
  "video/x-matroska", // .mkv
];

// ✅ File filter
const fileFilter = (req, file, cb) => {
  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type: " + file.mimetype), false);
  }
};

// ✅ Multer config using memoryStorage
const upload = multer({
  storage: multer.memoryStorage(), // Don't pass destination or filename here
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB per file
});

module.exports = upload;
