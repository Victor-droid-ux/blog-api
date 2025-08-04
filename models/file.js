const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    filename: {
      type: String,
      trim: true,
    },
    originalName: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    size: Number,
    mimetype: {
      type: String,
      trim: true,
    },
    contentType: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["uploaded", "failed"],
      default: "uploaded",
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
    deletedAt: Date,
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deletedReason: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      default: null,
    },
  },
  { timestamps: true }
);

// Index for soft deletion
fileSchema.index({ deleted: 1 });

const File = mongoose.model("File", fileSchema);
module.exports = File;
