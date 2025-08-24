import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const AddItemModal = ({
  show,
  onClose,
  onUpdateItem,
  data,
  onAddItem,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "",
    isLowStock: false,
    category: "",
  });

  const handleSubmit = () => {
    if (data?._id) {
      // Editing existing item
      onUpdateItem({ ...formData, _id: data._id });
    } else {
      // Adding new item
      onAddItem(formData);
    }
  };

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        quantity: String(data.quantity || ""),
        unit: data.unit || "",
        isLowStock: data.isLowStock ?? false, 
        category: data.category || "",
      });
    } else {
      // reset when adding a fresh item
      setFormData({
        name: "",
        quantity: "",
        unit: "",
        isLowStock: false,
        category: "",
      });
    }
  }, [data]);

  return (
    <Modal
      visible={show}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Add New Item</Text>
          <TextInput
            placeholder="Item name"
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          <TextInput
            placeholder="Quantity"
            style={styles.input}
            value={formData.quantity}
            onChangeText={(text) =>
              setFormData({ ...formData, quantity: text })
            }
          />
          <Text style={styles.label}>Unit</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.unit}
              onValueChange={(value) =>
                setFormData({ ...formData, unit: value })
              }
              style={styles.picker}
            >
              <Picker.Item label="Select unit" value="" />
              <Picker.Item label="g" value="g" />
              <Picker.Item label="kg" value="kg" />
              <Picker.Item label="ml" value="ml" />
              <Picker.Item label="l" value="l" />
              <Picker.Item label="pcs" value="pcs" />
              <Picker.Item label="tbsp" value="tbsp" />
              <Picker.Item label="tsp" value="tsp" />
              <Picker.Item label="cup" value="cup" />
            </Picker>
          </View>

          <View style={styles.switchRow}>
            <Switch
              value={formData.isLowStock}
              onValueChange={(val) =>
                setFormData({ ...formData, isLowStock: val })
              }
            />
            <Text style={{ fontSize: 14, marginLeft: 8 }}>
              Mark as low stock
            </Text>
          </View>

          <TextInput
            placeholder="Category (optional)"
            style={styles.input}
            value={formData.category}
            onChangeText={(text) =>
              setFormData({ ...formData, category: text })
            }
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={handleSubmit}
              disabled={!formData.name || !formData.quantity}
            >
              <Text style={styles.addBtnText}>
                {data?._id ? "Update Item" : "Add Item"}
              </Text>
            </TouchableOpacity>
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
    padding: 12,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 22,
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "left",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 10,
    marginBottom: 13,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
  },
  label: {
    fontWeight: "500",
    marginBottom: 7,
    marginLeft: 3,
    fontSize: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 13,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 13,
    marginTop: 20,
    justifyContent: "space-between",
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    marginRight: 8,
  },
  cancelBtnText: {
    color: "#22223b",
    fontWeight: "500",
    fontSize: 15,
  },
  addBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#2b6cb0",
    alignItems: "center",
    marginLeft: 8,
  },
  addBtnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
});

export default AddItemModal;
