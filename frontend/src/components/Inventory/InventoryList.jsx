import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const InventoryList = ({ inventory, showAddItem }) => {
  const lowStockItems = inventory && inventory.length > 0 && inventory?.filter(item => item.isLowStock) ? inventory?.filter((item) => item?.isLowStock) : [];

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.itemBox,
        item.isLowStock ? styles.lowStockBorder : styles.inStockBorder,
      ]}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.isLowStock && <Text style={styles.alertIcon}>⚠️</Text>}
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.detailLine}>
          Quantity: <Text style={styles.detailValue}>{item.quantity}</Text>
        </Text>
        <Text style={styles.detailLine}>
          Added by: <Text style={styles.detailValue}>{item.addedBy}</Text>
        </Text>
        <View style={styles.statusRow}>
          <Text>Status: </Text>
          {item.isLowStock ? (
            <Text style={styles.lowStockText}>Low Stock</Text>
          ) : (
            <Text style={styles.inStockText}>In Stock</Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>📦 Shared Inventory</Text>
        <TouchableOpacity style={styles.addButton} onPress={showAddItem}>
          <Text style={styles.addButtonText}>＋ Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <View style={styles.alertBox}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <Text style={styles.alertTitle}>Low Stock Alert</Text>
          </View>
          <View style={styles.alertList}>
            {lowStockItems.map(item => (
              <Text key={item.id} style={styles.alertText}>
                {item.name} is running low ({item.quantity} left)
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Inventory List */}
      <FlatList
        data={inventory}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={1} // For 2 columns, adjust to 2 if you want
        columnWrapperStyle={inventory.length > 1 ? styles.row : undefined}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 18,
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 22,
    color: '#1e293b',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  alertBox: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  alertIcon: {
    fontSize: 18,
    color: '#b91c1c',
  },
  alertTitle: {
    fontWeight: '700',
    color: '#b91c1c',
    fontSize: 16,
  },
  alertList: {
    gap: 4,
  },
  alertText: {
    color: '#b91c1c',
    fontSize: 14,
  },
  itemBox: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 6,
    flex: 1,
    marginHorizontal: 6,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  lowStockBorder: {
    borderLeftColor: '#f87171', // red-400
  },
  inStockBorder: {
    borderLeftColor: '#34d399', // green-400
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  itemName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1e293b',
  },
  itemDetails: {
    marginTop: 2,
  },
  detailLine: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  },
  detailValue: {
    fontWeight: '500',
    color: '#334155',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lowStockText: {
    color: '#dc2626',
    fontWeight: '600',
  },
  inStockText: {
    color: '#22c55e',
    fontWeight: '600',
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default InventoryList;
