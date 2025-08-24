// models/Expense.js
const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
  item: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: String, required: true }, // member name or ID
  splitBetween: [{ type: String, required: true }], // array of member names or IDs
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports =  mongoose.model("Expense", expenseSchema);
