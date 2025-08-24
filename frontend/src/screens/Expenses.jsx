import React, { useState, useEffect } from "react";
import { View, Modal, TouchableOpacity, Text, StyleSheet } from "react-native";
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
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    type: "",
    message: "",
    onConfirm: null,
  });

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const {_id:kitchenId} = useSelector((state) => state.kitchen?.kitchen);
  const members = useSelector((state) => state.kitchen?.members);
  const expenses = useSelector((state) => state.expenses?.expenses);
  const balances = useSelector((state) => state.expenses?.balances);

  useEffect(() => {
    if (kitchenId) {
      dispatch(fetchExpenses(kitchenId));
      dispatch(fetchBalances(kitchenId));
    }
  }, [kitchenId, dispatch]);

  const handleAddExpense = (newExpense) => {
    if (editingExpense) {
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

      {/* Small Button to show Balance Summary */}
      <TouchableOpacity
        style={styles.balanceButton}
        onPress={() => setShowBalanceModal(true)}
      >
        <Text style={styles.balanceButtonText}>View Balances</Text>
      </TouchableOpacity>

      {/* Popup Modal */}
      <Modal
        visible={showBalanceModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBalanceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Balances</Text>
            <BalanceSummary
              members={members}
              balances={balances}
              currentUserId={user?._id}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowBalanceModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

const styles = StyleSheet.create({
  balanceButton: {
    backgroundColor: "teal",
    padding: 14,
    margin: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20
  },
  balanceButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default ExpensesPage;
