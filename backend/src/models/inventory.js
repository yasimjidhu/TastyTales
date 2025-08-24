const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    kitchenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kitchen",
      required: true,  // Inventory must belong to a kitchen
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional, used to track who added it
    },
    addedBy: {
      type: String,
      required: false, // Optional, can store username or userId
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      enum: ["g", "kg", "ml", "l", "pcs", "tbsp", "tsp", "cup", "other"],
      default: "pcs",
    },
    category: {
      type: String,
      default: "Other",
    },
    isLowStock: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
