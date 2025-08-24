// routes/expenseRoutes.js
const express = require("express");
const { addExpense,
    updateExpense,
  getExpenses,
    getBalances,
    deleteExpense,
} = require("../controller/expenseController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);


router.get("/:kitchenId/expenses", getExpenses);
router.put("/:kitchenId/expenses/:expenseId", updateExpense);
router.delete("/:kitchenId/expenses/:expenseId", deleteExpense);
router.post("/:kitchenId/expenses", addExpense);
router.get("/:kitchenId/balances", getBalances);

module.exports = router;
