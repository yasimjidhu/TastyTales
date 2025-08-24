import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Package, Plus, AlertTriangle } from "lucide-react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchInventory,
  addInventoryItem,
  deleteInventoryItem,
  updateInventoryItem,
} from "../store/slices/inventory";
import AddItemModal from "../components/Inventory/AddItemModal";
import CustomAlert from "../components/Alert";

const InventoryScreen = () => {
  const dispatch = useDispatch();
  const { items: inventory, loading } = useSelector(
    (state) => state?.inventory
  );
  const members = useSelector((state) => state.kitchen?.members);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // for pre-filling form in modal
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    type: "",
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    dispatch(fetchInventory());
    console.log("Fetched inventory",members)
  }, [dispatch]);

  const handleAddItem = (newItem) => {
    console.log("Adding new item:", newItem);
    dispatch(addInventoryItem(newItem));
    setShowAddItem(false);
  };

  const handleUpdateItem = (updatedItem) => {
    dispatch(
      updateInventoryItem({ itemId: updatedItem._id, updates: updatedItem })
    );
    setEditingItem(null); // clear edit mode
    setShowAddItem(false); // close modal
  };

  const handleDeleteItem = (itemId) => {
    setAlertConfig({
      visible: true,
      title: "Confirm Delete",
      type: "warning",
      message: "Are you sure you want to delete this item?",
      onConfirm: () => {
        dispatch(deleteInventoryItem(itemId));
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

  const lowStockItems = inventory?.filter((item) => item?.isLowsStock);

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Low Stock Alerts */}
        {lowStockItems && lowStockItems.length > 0 && (
          <View style={styles.alertContainer}>
            <View style={styles.alertHeader}>
              <AlertTriangle size={20} color="#DC2626" />
              <Text style={styles.alertTitle}>Low Stock Alert</Text>
            </View>
            {lowStockItems.map((item) => (
              <Text key={item._id} style={styles.alertText}>
                {item.name} is running low ({item.quantity} {item.unit} left)
              </Text>
            ))}
          </View>
        )}

        {/* Inventory List */}
        <View style={styles.inventoryList}>
          {inventory &&
            inventory.length > 0 &&
            inventory.map((item) => (
              <View
                key={item._id}
                style={[
                  styles.itemCard,
                  { borderLeftColor: item.isLowsStock ? "#EF4444" : "#10B981" },
                ]}
              >
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.isLowsStock && (
                    <AlertTriangle size={16} color="#EF4444" />
                  )}
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemDetail}>
                    Quantity:{" "}
                    <Text style={styles.detailValue}>
                      {item.quantity} {item.unit}
                    </Text>
                  </Text>
                  <Text style={styles.itemDetail}>
                    Category:{" "}
                    <Text style={styles.detailValue}>{item.category}</Text>
                  </Text>
                  <Text style={styles.itemDetail}>
                    Status:
                    <Text
                      style={
                        item.isLowsStock ? styles.lowStock : styles.inStock
                      }
                    >
                      {item.isLowsStock ? " Low Stock" : " In Stock"}
                    </Text>
                  </Text>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => {
                      setShowAddItem(true);
                      setEditingItem(item); // pass this to modal for pre-filled form
                    }}
                  >
                    <Text style={styles.btnText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={()=> handleDeleteItem(item._id)}
                  >
                    <Text style={styles.btnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>

      {/* Add Item Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddItem(true)}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>

      {/* Add Item Modal */}
      <AddItemModal
        show={showAddItem}
        data={editingItem}
        onClose={() => {
          setShowAddItem(false);
          setEditingItem(null);
        }}
        members={members}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
      />
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        type={alertConfig.type}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm}
        onCancel={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  alertContainer: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  alertTitle: {
    color: "#DC2626",
    fontWeight: "bold",
    marginLeft: 8,
  },
  alertText: {
    color: "#DC2626",
    fontSize: 14,
    marginLeft: 28,
  },
  inventoryList: {
    padding: 16,
  },
  itemCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  itemDetails: {
    gap: 4,
  },
  itemDetail: {
    fontSize: 14,
    color: "#6B7280",
  },
  itemActions: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "flex-end",
    gap: 10,
  },
  editBtn: {
    backgroundColor: "#FBBF24",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
  },
  detailValue: {
    fontWeight: "500",
    color: "#374151",
  },
  lowStock: {
    color: "#EF4444",
    fontWeight: "500",
  },
  inStock: {
    color: "#10B981",
    fontWeight: "500",
  },
  addButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#3B82F6",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default InventoryScreen;
