const uploadMultipleFiles = async (req, res, next) => {
  try {
    const files = req;
    console.log(files);
    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "No files uploaded" });
    }

    const fileInfo = files.map((file) => ({
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
    }));

    res.status(200).json({
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
