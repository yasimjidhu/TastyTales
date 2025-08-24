import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = ({ lowStockCount }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>👩‍🍳</Text>
          <Text style={styles.title}>Shared Kitchen Manager</Text>
        </View>
        <View style={styles.notificationRow}>
          <Text style={styles.bellIcon}>🔔</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{lowStockCount}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  innerContainer: {
    maxWidth: 1024,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 32,
    color: '#3b82f6', // blue-500
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b', // gray-800
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bellIcon: {
    fontSize: 20,
    color: '#4b5563', // gray-600
  },
  badge: {
    backgroundColor: '#ef4444', // red-500
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default Header;
