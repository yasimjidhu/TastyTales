const Kitchen = require('../models/kitchen.js')
const Expense = require('../models/expenses.js')

exports.getExpenses = async (req, res) => {
  try {
    const kitchen = await Kitchen.findById(req.params.kitchenId)
      .populate({
        path: "expenses",
        options: { sort: { createdAt: -1 } } // newest first
      });

    res.json({ expenses: kitchen.expenses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.addExpense = async (req, res) => {
  try {
    const { item, amount, paidBy, splitBetween } = req.body;
    const { kitchenId } = req.params;

    const kitchen = await Kitchen.findById(kitchenId);
    if (!kitchen) return res.status(404).json({ error: "Kitchen not found" });

    const expense = new Expense({ item, amount, paidBy, splitBetween });
    await expense.save();

    kitchen.expenses.push(expense._id);

    // update balances
    const perPerson = amount / splitBetween.length;

    splitBetween.forEach(member => {
      kitchen.balances.set(member, (kitchen.balances.get(member) || 0) - perPerson);
    });
    kitchen.balances.set(paidBy, (kitchen.balances.get(paidBy) || 0) + amount);

    await kitchen.save();


    res.status(201).json({ expense, balances: kitchen.balances });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { kitchenId, expenseId } = req.params;
    const { item, amount, paidBy, splitBetween,date } = req.body;

    const kitchen = await Kitchen.findById(kitchenId);
    if (!kitchen) return res.status(404).json({ error: "Kitchen not found" });

    const expense = await Expense.findById(expenseId);
    if (!expense) return res.status(404).json({ error: "Expense not found" });

    // Revert old balances
    const oldPerPerson = expense.amount / expense.splitBetween.length;
    expense.splitBetween.forEach(member => {
      kitchen.balances.set(member, (kitchen.balances.get(member) || 0) + oldPerPerson);
    });
    kitchen.balances.set(expense.paidBy, (kitchen.balances.get(expense.paidBy) || 0) - expense.amount);

    // Update expense fields
    expense.item = item;
    expense.amount = amount;
    expense.paidBy = paidBy;
    expense.splitBetween = splitBetween;
    expense.date = date ? new Date(date) : expense.date; // preserve old date if not provided
    await expense.save();

    // Apply new balances
    const perPerson = amount / splitBetween.length;
    splitBetween.forEach(member => {
      kitchen.balances.set(member, (kitchen.balances.get(member) || 0) - perPerson);
    });
    kitchen.balances.set(paidBy, (kitchen.balances.get(paidBy) || 0) + amount);

    await kitchen.save();

    res.json({ expense, balances: kitchen.balances });
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId);
    if (!expense) return res.status(404).json({ error: "Expense not found" });

    const kitchen = await Kitchen.findOne({ expenses: expenseId });
    if (!kitchen) return res.status(404).json({ error: "Kitchen not found" });

    // Remove expense effect from balances
    const amount = expense.amount;
    const split = expense.splitBetween;
    const paidBy = expense.paidBy;
    const perPerson = amount / split.length;

    split.forEach(member => {
      kitchen.balances.set(member, (kitchen.balances.get(member) || 0) + perPerson);
    });
    kitchen.balances.set(paidBy, (kitchen.balances.get(paidBy) || 0) - amount);

    // Remove from kitchen expenses array
    kitchen.expenses = kitchen.expenses.filter(id => id.toString() !== expenseId);
    await kitchen.save();

    // Delete expense document
    await expense.deleteOne();

    res.json({ message: "Expense deleted successfully", balances: kitchen.balances, expenseId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getBalances = async (req, res) => {
  try {
    const kitchen = await Kitchen.findById(req.params.kitchenId);
    res.json({ balances: kitchen.balances, members: kitchen.members });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
