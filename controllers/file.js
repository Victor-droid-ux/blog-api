const path = require("path");
const validateExtension = require("../validators/file");
const {
  uploadMultipleFiles: uploadToS3,
  signedUrl,
  deleteFileFromS3: deleteFile, // Imported and renamed here
} = require("../utils/awsS3");
const File = require("../models/file");

const uploadMultipleFiles = async (req, res, next) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "No files uploaded" });
    }

    const invalid = files.find((file) => !validateExtension(file));
    if (invalid) {
      return res.status(400).json({
        status: false,
        message: `Invalid file type: ${invalid.originalname}`,
      });
    }

    const s3Results = await uploadToS3({ files });
    if (!s3Results || s3Results.length === 0) {
      return res.status(500).json({
        status: false,
        message: "Failed to upload files to S3",
      });
    }

    const fileInfo = s3Results.map((file, idx) => ({
      originalName: file.originalName || files[idx].originalname,
      filename: file.filename || files[idx].filename,
      mimetype: file.mimetype || files[idx].mimetype,
      contentType: file.contentType || files[idx].contentType,
      key: file.key || files[idx].key,
      size: files[idx].size,
      url: file.url || null,
      status: file.error ? "failed" : "uploaded",
      uploadedBy: req.user?._id || null,
      uploadedAt: new Date(),
    }));

    await File.insertMany(
      fileInfo.map((f) => ({
        ...f,
        createdBy: req.user?._id || null,
      }))
    );

    return res.status(200).json({
      status: true,
      message: "Files uploaded successfully",
      files: fileInfo,
    });
  } catch (err) {
    next(err);
  }
};

const getSignedUrl = async (req, res, next) => {
  try {
    const key = req.query.key || req.params.key || req.body.key || null;

    if (!key) {
      return res
        .status(400)
        .json({ status: false, message: "File key is required" });
    }

    const url = await signedUrl(key);
    if (!url) {
      return res
        .status(500)
        .json({ status: false, message: "Failed to generate signed URL" });
    }

    return res.status(200).json({
      status: true,
      message: "Signed URL generated successfully",
      url,
    });
  } catch (err) {
    next(err);
  }
};

const deleteFileHandler = async (req, res, next) => {
  try {
    const key = req.query.key || req.params.key || req.body.key || null;

    console.log("Deleting file with key:", key); // Debugging log

    if (!key) {
      return res
        .status(400)
        .json({ status: false, message: "File key is required" });
    }

    const result = await deleteFile(key); // ✅ Corrected usage
    if (!result || !result.status) {
      return res.status(500).json({
        status: false,
        message: "Failed to delete file from S3",
      });
    }

    await File.deleteOne({ key });

    return res.status(200).json({
      status: true,
      message: "File deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadMultipleFiles,
  getSignedUrl,
  deleteFile: deleteFileHandler,
};
