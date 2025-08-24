// models/kitchen.js
const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },  // store username directly
  role: { type: String, enum: ["admin", "member"], default: "member" }
});

const kitchenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  inviteCode: { type: String, unique: true, required: true },
  members: [memberSchema],
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
  balances: { type: Map, of: Number, default: {} },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Kitchen", kitchenSchema);
