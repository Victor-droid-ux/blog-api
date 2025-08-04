const {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const path = require("path");
const generateCode = require("../utils/generateCode");
const {
  awsRegion,
  awsAccessKeyId,
  awsSecretAccessKey,
} = require("../config/kyes");

const s3Client = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
});

const uploadMultipleFiles = async ({ files }) => {
  const uploadResults = await Promise.allSettled(
    files.map(async (file) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeBaseName = path
        .basename(file.originalname, ext)
        .replace(/\s+/g, "_")
        .toLowerCase();

      const fileName = `${Date.now()}-${safeBaseName}-${generateCode(8)}${ext}`;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      try {
        await s3Client.send(new PutObjectCommand(params));
        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${awsRegion}.amazonaws.com/${fileName}`;

        return {
          originalName: file.originalname,
          filename: fileName,
          key: fileName, // 💥 Add this line
          url: fileUrl,
          size: file.size,
          mimetype: file.mimetype,
          contentType: file.mimetype, // Optional for schema
          status: "uploaded",
        };
      } catch (err) {
        console.error("❌ Failed to upload:", file.originalname, err);
        return {
          originalName: file.originalname,
          filename: fileName,
          key: fileName, // 💥 Again, add this
          size: file.size,
          mimetype: file.mimetype,
          url: null,
          status: "failed",
          error: err.message,
        };
      }
    })
  );

  return uploadResults.map((res) =>
    res.status === "fulfilled" ? res.value : res.value
  );
};

// Generate signed URL
const signedUrl = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Expires: 60 * 60, // 60 minutes
  };

  const command = new GetObjectCommand(params);

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  } catch (err) {
    console.error("❌ Error generating signed URL:", err);
    throw new Error("Failed to generate signed URL");
  }
};

const deleteFileFromS3 = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };

  const command = new DeleteObjectCommand(params);

  try {
    await s3Client.send(new DeleteObjectCommand(params));
    return { status: true, message: "File deleted successfully" };
  } catch (err) {
    console.error("❌ Error deleting file:", err);
    throw new Error("Failed to delete file");
  }
};

module.exports = {
  uploadMultipleFiles,
  signedUrl,
  deleteFileFromS3,
};
