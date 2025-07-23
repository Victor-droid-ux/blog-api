const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    size: Number,
    mimetype: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: Date.now },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deleted: { type: Boolean, default: false },
    deletedReason: String,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const file = mongoose.model("file", fileSchema);

module.exports = file;