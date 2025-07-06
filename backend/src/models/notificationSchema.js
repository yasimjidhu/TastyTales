const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    type: { type: String, enum: ["follow", "like", "comment"], required: true },
    message: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
