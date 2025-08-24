import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const iconsMap = {
  inventory: '📦',
  expenses: '💰',
  schedule: '📅',
  members: '👥',
};

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'inventory', label: 'Inventory' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'members', label: 'Members' },
  ];

  return (
    <View style={styles.navContainer}>
      <View style={styles.innerNav}>
        {tabs.map(({ id, label }) => {
          const isActive = activeTab === id;
          return (
            <TouchableOpacity
              key={id}
              onPress={() => setActiveTab(id)}
              style={[styles.tabButton, isActive && styles.activeTab]}
              activeOpacity={0.7}
            >
              <Text style={[styles.icon, isActive && styles.activeIcon]}>
                {iconsMap[id]}
              </Text>
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  innerNav: {
    maxWidth: 1024,
    alignSelf: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3b82f6', // blue-500
  },
  icon: {
    fontSize: 16,
    color: '#6b7280', // gray-500
  },
  activeIcon: {
    color: '#2563eb', // blue-600
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280', // gray-500
  },
  activeLabel: {
    color: '#2563eb', // blue-600
    fontWeight: '700',
  },
});

export default Navigation;
