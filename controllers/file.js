const path = require("path");
const validateExtension = require("../validators/file");
const { uploadMultipleFiles: uploadToS3 } = require("../utils/awsS3");

const uploadMultipleFiles = async (req, res, next) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "No files uploaded" });
    }

    // ✅ Validate all file extensions
    const invalid = files.find((file) => {
      const ext = path.extname(file.originalname).toLowerCase();
      return !validateExtension(ext);
    });

    if (invalid) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid file type" });
    }

    // ✅ Upload to S3
    const s3Results = await uploadToS3({ files });

    const fileInfo = s3Results.map((file, idx) => ({
      originalName: file.originalName,
      filename: file.filename,
      size: files[idx].size,
    }));

    return res.status(200).json({
      status: true,
      message: "Files uploaded successfully",
      files: fileInfo,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadMultipleFiles,
};
