const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
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
          status: "fulfilled",
          value: {
            originalName: file.originalname,
            filename: fileName,
            url: fileUrl,
            size: file.size,
            mimetype: file.mimetype,
          },
        };
      } catch (err) {
        console.error("❌ Failed to upload:", file.originalname, err);
        return {
          status: "rejected",
          reason: err.message,
          file: file.originalname,
        };
      }
    })
  );

  const successful = uploadResults
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  const failed = uploadResults
    .filter((r) => r.status === "rejected")
    .map((r) => ({
      file: r.file,
      reason: r.reason,
    }));

  if (failed.length > 0) {
    console.warn("⚠️ Some files failed to upload:", failed);
    throw {
      status: 500,
      message: "One or more file uploads failed",
      failed,
      uploaded: successful,
    };
  }

  return successful;
};

module.exports = { uploadMultipleFiles };
