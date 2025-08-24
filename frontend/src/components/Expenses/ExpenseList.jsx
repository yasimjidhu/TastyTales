import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";

const ExpenseList = ({
  expenses,
  showAddExpense,
  onEditExpense,
  onDeleteExpense,
}) => {
  const members = useSelector((state) => state.kitchen?.members || []);

  // Helper to get username from userId
  const getUserName = (userId) => {
    const member = members.find((m) => m.userId === userId);
    return member ? member.userName : "Unknown";
  };

  // Helper to convert array of userIds to comma-separated names
  const getSplitNames = (userIds = []) => {
    console.log("userIds in getSplitNames:", userIds);
    return userIds.map((id) => getUserName(id)).join(", ");
  };

  console.log("members in ExpenseList:", members);
  const renderExpense = ({ item: expense }) => (
    <View style={styles.expenseBox}>
      <View style={styles.expenseHeader}>
        <Text style={styles.expenseTitle}>{expense.item}</Text>
        <Text style={styles.expenseAmount}>₹{expense.amount}</Text>
      </View>

      {/* Meta */}
      <View style={styles.expenseMeta}>
        <Text style={styles.metaLine}>
          Paid by:{" "}
          <Text style={styles.metaValue}>{getUserName(expense.paidBy)}</Text>
        </Text>
        <Text style={styles.metaLine}>
          Split between:{" "}
          <Text style={styles.metaValue}>
            {getSplitNames(expense.splitBetween)}
          </Text>
        </Text>
        <Text style={styles.metaLine}>
          Per person:{" "}
          <Text style={styles.metaValue}>
            ₹{(expense.amount / expense.splitBetween.length).toFixed(0)}
          </Text>
        </Text>
        <Text style={styles.metaLine}>
          Date:{" "}
          <Text style={styles.metaValue}>
            {new Date(expense.date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </Text>
      </View>

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          onPress={() => onEditExpense(expense)}
          style={styles.editBtn}
        >
          <Text style={styles.actionText}>✏️ Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDeleteExpense(expense._id)}
          style={styles.deleteBtn}
        >
          <Text style={styles.actionText}>🗑 Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>💸 Expense Splitter</Text>
        <TouchableOpacity style={styles.addBtn} onPress={showAddExpense}>
          <Text style={styles.addBtnText}>＋ Add Expense</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <View style={{ marginTop: 18,flex:1 }}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        <FlatList
          data={expenses}
          keyExtractor={(item) => String(item._id)}
          renderItem={renderExpense}
          contentContainerStyle={{ paddingBottom: 20,flexGrow:1 }}
          ListEmptyComponent={
            <Text style={{ color: "#666", textAlign: "center", marginTop: 18 }}>
              No expenses yet.
            </Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex:1,gap: 20, padding: 14 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
    flexDirection: "row",
    alignItems: "center",
  },
  addBtn: {
    backgroundColor: "#22c55e",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  addBtnText: { color: "white", fontWeight: "600", fontSize: 15 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#22223b",
    marginBottom: 8,
  },
  expenseBox: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  expenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  expenseTitle: { fontWeight: "bold", color: "#1e293b", fontSize: 16 },
  expenseAmount: { fontWeight: "bold", color: "#16a34a", fontSize: 18 },
  expenseMeta: { marginTop: 2 },
  metaLine: { fontSize: 13, color: "#64748b", marginBottom: 3 },
  metaValue: { fontWeight: "500", color: "#334155" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    gap: 10,
  },
  editBtn: { padding: 6, backgroundColor: "#facc15", borderRadius: 6 },
  deleteBtn: { padding: 6, backgroundColor: "#ef4444", borderRadius: 6 },
  actionText: { color: "white", fontWeight: "600" },
});

export default ExpenseList;
