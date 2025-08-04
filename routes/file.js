const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/isAuth");
const { fileController } = require("../controllers");
const upload = require("../middlewares/upload");

// === Route: Upload multiple files ===
// Expects 'files' field in form-data, max 5 files
router.post(
  "/upload",
  isAuth,
  upload.array("files", 5), // field name = files
  fileController.uploadMultipleFiles
);


// === Route: Get signed URL for file access ===
// Expects 'key' query param or body field
router.get("/signed-url", isAuth, fileController.getSignedUrl);

router.delete("/delete-file", isAuth, fileController.deleteFile);

module.exports = router;
