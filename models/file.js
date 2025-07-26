const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true, // unique identifier for file (e.g., filename or S3 key)
      trim: true,
    },
    url: {
      type: String, // public URL to access the file
      trim: true,
    },
    size: {
      type: Number, // in bytes
    },
    mimetype: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Soft delete fields
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deletedReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for faster soft-delete lookups
fileSchema.index({ deleted: 1 });

const File = mongoose.model("File", fileSchema);

module.exports = File;
