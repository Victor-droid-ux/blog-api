const express = require("express");
const router = express.Router();

const isAuth = require("../middlewares/isAuth");
const upload = require("../middlewares/upload");
const { fileController } = require("../controllers");

// === Route: Upload multiple files ===
// Expects 'files' field in form-data, max 5 files
router.post(
  "/upload",
  isAuth,
  upload.array("files", 5), // field name = files
  fileController.uploadMultipleFiles
);

module.exports = router;
