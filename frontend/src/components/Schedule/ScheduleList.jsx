import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const ScheduleList = ({ schedule, showAddSchedule,members=[] }) => {

  const getUserName = (userId) => {
    const member = members.find(m => m.userId === userId);
    return member ? member.userName : 'Unknown';
  };

  const renderItem = ({ item }) => (
    <View style={styles.scheduleItem}>
      <View style={styles.scheduleHeader}>
        <View>
          <View style={styles.dayRow}>
            <Text style={styles.chefIcon}>👩‍🍳</Text>
            <Text style={styles.dayText}>{item.day}</Text>
          </View>
          <Text style={styles.dishText}>{item.dish}</Text>
        </View>
        <View style={styles.timeSection}>
          <Text style={styles.cookText}>
            Cook: <Text style={styles.cookName}>{getUserName(item.cook).toUpperCase()}</Text>
          </Text>
          <View style={styles.timeRow}>
            <Text style={styles.clockIcon}>⏰</Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          📅 Cooking Schedule
        </Text>
        <TouchableOpacity style={styles.addBtn} onPress={showAddSchedule}>
          <Text style={styles.addBtnText}>＋ Add Schedule</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={schedule}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b', // gray-800
  },
  addBtn: {
    backgroundColor: '#8b5cf6', // purple-500
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  scheduleItem: {
    backgroundColor: 'white',
    padding: 16,
    borderLeftWidth: 6,
    borderLeftColor: '#a78bfa', // purple-400
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  chefIcon: {
    fontSize: 16,
    color: '#8b5cf6',
  },
  dayText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1e293b',
  },
  dishText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#7c3aed', // purple-700
  },
  timeSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  cookText: {
    fontSize: 13,
    color: '#64748b', // gray-600
    marginBottom: 6,
  },
  cookName: {
    fontWeight: '600',
    color: '#334155',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clockIcon: {
    fontSize: 13,
    color: '#374151',
  },
  timeText: {
    color: '#64748b',
    fontSize: 13,
  },
});

export default ScheduleList;
