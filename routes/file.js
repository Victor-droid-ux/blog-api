const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const isAuth = require("../middlewares/isAuth");
const { fileController } = require("../controllers");
const upload = require("../middlewares/upload");

// Storage and filter setup

// Single file upload
// router.post("/upload", isAuth, upload.single("file"), fileController.uploadFile);

// Multiple file upload (e.g., 5 max)
router.post(
  "/upload",
  isAuth,
  upload.single("files"),
  fileController.uploadMultipleFiles
);
  
module.exports = router;
