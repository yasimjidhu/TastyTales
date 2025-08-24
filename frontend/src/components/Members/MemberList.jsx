import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const MemberList = ({
  members = [],
  inventory = [],
  expenses = [],
  schedule = [],
  balances = {},
}) => {
  
  const { user } = useSelector(state => state.user)

  const renderMember = ({ item: member }) => {
    const balance = balances[member.userId] || 0;

    let balanceStyle = styles.balanceNeutral;
    let balanceText = "All settled up";

    if (balance > 0) {
      balanceStyle = styles.balancePositive;
      balanceText = `₹${balance.toFixed(0)} to receive`;
    } else if (balance < 0) {
      balanceStyle = styles.balanceNegative;
      balanceText = `To pay ₹${Math.abs(balance).toFixed(0)}`;
    }

    return (
      <View key={member._id} style={styles.memberCard}>
        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {member?.userName?.charAt(0)?.toUpperCase() || "?"}
            </Text>
          </View>
          <View style={styles.nameAndBalance}>
            <Text style={styles.memberName}>{member?.userName}</Text>
            <Text style={[styles.balanceText, balanceStyle]}>
              {balanceText}
            </Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>🥕</Text>
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Items Added</Text>
              <Text style={styles.statValue}>
                {
                  inventory.filter(
                    (i) => i.addedBy === member._id || i.addedBy === member.userId
                  ).length
                }
              </Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>💰</Text>
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Expenses Paid</Text>
              <Text style={styles.statValue}>
                ₹{expenses
                  .filter((e) => e.paidBy === member.userId)
                  .reduce((sum, e) => sum + e.amount, 0)
                  .toFixed(0)}
              </Text>
              <Text style={styles.statSubtext}>
                {expenses.filter((e) => e.paidBy === member.userId).length} transactions
              </Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>🍳</Text>
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Cooking Slots</Text>
              <Text style={styles.statValue}>
                {schedule.filter((s) => s.cook === member.userId).length}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerIconContainer}>
          <Text style={styles.headerIcon}>👥</Text>
        </View>
        <Text style={styles.headerTitle}>Kitchen Members</Text>
        <View style={styles.memberCount}>
          <Text style={styles.memberCountText}>{members.length}</Text>
        </View>
      </View>
      
      <FlatList
        data={members}
        keyExtractor={(item) => item._id}
        renderItem={renderMember}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={
          members && members.length > 1 ? styles.columnWrapper : undefined
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#14b8a6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerIcon: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    flex: 1,
  },
  memberCount: {
    backgroundColor: '#14b8a6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  memberCountText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  memberCard: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    backgroundColor: "#14b8a6",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
  nameAndBalance: {
    flex: 1,
  },
  memberName: {
    fontWeight: "600",
    fontSize: 15,
    color: "#1f2937",
    marginBottom: 2,
  },
  balanceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  balancePositive: {
    color: "#14b8a6",
  },
  balanceNegative: {
    color: "#1f2937",
  },
  balanceNeutral: {
    color: "#6b7280",
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginBottom: 12,
  },
  statsSection: {
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 24,
    height: 24,
    backgroundColor: '#f0fdfa',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statIcon: {
    fontSize: 12,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: '500',
    marginBottom: 1,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
  },
  statSubtext: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 1,
  },
});

export default MemberList;