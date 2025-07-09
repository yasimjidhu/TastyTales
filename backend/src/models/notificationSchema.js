const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },
    type: {
      type: String,
      enum: ["follow", "like", "comment", "mention", "custom"],
      required: true
    },
    message: {
      type: String,
      default: ""
    },
    read: {
      type: Boolean,
      default: false
    },
    relatedResource: {
      type: mongoose.Schema.Types.ObjectId, // e.g., Recipe, Post, Comment, etc.
      refPath: "resourceType"
    },
    resourceType: {
      type: String,
      enum: ["recipes", "reviews", "users"], // Adjust based on your app entities
      required: function () {
        return !!this.relatedResource;
      }
    }
  },
  { timestamps: true }
);  

module.exports = mongoose.model("notifications", notificationSchema);
