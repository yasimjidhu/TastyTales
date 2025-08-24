import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Switch,
  FlatList,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const AddExpenseModal = ({
  show,
  onClose,
  members = [], // now expecting array of { user, role, _id }
  onAddExpense,
  editingExpense,
}) => {
  const [formData, setFormData] = useState({
    item: "",
    amount: "",
    paidBy: "",
    splitBetween: members.map((m) => m.userId), // store user IDs
    date: new Date(),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  React.useEffect(() => {
    if (editingExpense) {
      setFormData({
        ...editingExpense,
        date: new Date(editingExpense.date),
        amount: String(editingExpense.amount),
      });
    } else {
      setFormData({
        item: "",
        amount: "",
        paidBy: "",
        splitBetween: members.map((m) => m.userId),
        date: new Date(),
      });
    }
  }, [editingExpense]); // remove members

  const handleSplitChange = (memberId) => {
    const newSplit = formData.splitBetween.includes(memberId)
      ? formData.splitBetween.filter((m) => m !== memberId)
      : [...formData.splitBetween, memberId];
    setFormData({ ...formData, splitBetween: newSplit });
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.date;
    setShowDatePicker(Platform.OS === "ios");
    setFormData({ ...formData, date: currentDate });
  };

  const handleSubmit = () => {
    onAddExpense({
      ...formData,
      amount: parseFloat(formData.amount),
      date: formData.date.toISOString().split("T")[0],
      id: editingExpense ? editingExpense.id : Date.now(),
    });
    onClose();
  };

  console.log('members are in addexpensemodal',members)

  return (
    <Modal
      visible={show}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalView}>
          <Text style={styles.title}>
            {editingExpense ? "Edit Expense" : "Add New Expense"}
          </Text>

          {/* Item */}
          <TextInput
            placeholder="Item/Description"
            style={styles.input}
            value={formData.item}
            onChangeText={(text) => setFormData({ ...formData, item: text })}
          />

          {/* Amount */}
          <TextInput
            placeholder="Amount (₹)"
            style={styles.input}
            value={formData.amount}
            keyboardType="decimal-pad"
            onChangeText={(text) => setFormData({ ...formData, amount: text })}
          />

          {/* Who Paid */}
          <Text style={styles.label}>Who paid?</Text>
          <FlatList
            data={members}
            horizontal
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.pickerOption,
                  formData.paidBy === item.userId &&
                    styles.selectedPickerOption,
                ]}
                onPress={() =>
                  setFormData({ ...formData, paidBy: item.userId })
                }
              >
                <Text
                  style={
                    formData.paidBy === item.userId
                      ? styles.selectedPickerOptionText
                      : {}
                  }
                >
                  {item.userName || "Unknown"}
                </Text>
              </TouchableOpacity>
            )}
          />

          {/* Split between */}
          <Text style={styles.label}>Split between:</Text>
          {members.map((member) => (
            <View style={styles.splitRow} key={member._id}>
              <Switch
                value={formData.splitBetween.includes(member.userId)}
                onValueChange={() => handleSplitChange(member.userId)}
              />
              <Text>{member.userName || "Unknown"}</Text>
            </View>
          ))}

          {/* Date */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            <Text>{`Date: ${formData.date.toISOString().split("T")[0]}`}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <Button title="Cancel" onPress={onClose} color="#888" />
            <Button
              title={editingExpense ? "Update Expense" : "Add Expense"}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  pickerOption: {
    padding: 8,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginRight: 8,
  },
  selectedPickerOption: {
    backgroundColor: "#4ade80",
  },
  selectedPickerOptionText: {
    color: "white",
    fontWeight: "bold",
  },
  splitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    gap: 10,
  },
});

export default AddExpenseModal;
