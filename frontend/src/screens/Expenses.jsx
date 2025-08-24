import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchExpenses,
  fetchBalances,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../store/slices/expenses";
import ExpenseList from "../components/Expenses/ExpenseList";
import BalanceSummary from "../components/Expenses/BalanceSummary";
import AddExpenseModal from "../components/Expenses/AddExpenseModal";
import CustomAlert from "../components/Alert";

const ExpensesPage = () => {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    type: "",
    message: "",
    onConfirm: null,
  });

  const dispatch = useDispatch();
  const kitchenId = useSelector((state) => state.kitchen?.kitchenId);
  const members = useSelector((state) => state.kitchen?.members);

  const expenses = useSelector((state) => state.expenses?.expenses);
  const balances = useSelector((state) => state.expenses?.balances);
  console.log('balances',balances)

  // ✅ Fetch data only when kitchenId changes
  useEffect(() => {
    if (kitchenId) {
      dispatch(fetchExpenses(kitchenId));
      dispatch(fetchBalances(kitchenId));
    }
  }, [kitchenId, dispatch]);


  const handleAddExpense = (newExpense) => {
    if (editingExpense) {
      console.log("updating expense", newExpense);
      dispatch(
        updateExpense({
          kitchenId,
          expenseId: editingExpense._id,
          updates: newExpense,
        })
      );
    } else {
      dispatch(addExpense({ kitchenId, expense: newExpense }));
    }
    setEditingExpense(null);
    setShowExpenseModal(false);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowExpenseModal(true);
  };

  const handleDeleteExpense = (id) => {
    setAlertConfig({
      visible: true,
      title: "Confirm Delete",
      type: "warning",
      message: "Are you sure you want to delete this item?",
      onConfirm: () => {
        dispatch(deleteExpense({ kitchenId, expenseId: id }));
        setAlertConfig({
          visible: true,
          title: "Item Deleted",
          type: "success",
          message: "The item has been successfully deleted.",
          onConfirm: () =>
            setAlertConfig((prev) => ({ ...prev, visible: false })),
        });
      },
    });
  };

  return (
    <>
      <ExpenseList
        expenses={expenses}
        showAddExpense={() => {
          setEditingExpense(null);
          setShowExpenseModal(true);
        }}
        onEditExpense={handleEditExpense}
        onDeleteExpense={handleDeleteExpense}
      />
      <BalanceSummary members={members} balances={balances} />
      <AddExpenseModal
        show={showExpenseModal}
        onClose={() => {
          setShowExpenseModal(false);
          setEditingExpense(null);
        }}
        members={members}
        onAddExpense={handleAddExpense}
        editingExpense={editingExpense}
      />
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        type={alertConfig.type}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm}
        onCancel={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </>
  );
};

export default ExpensesPage;
