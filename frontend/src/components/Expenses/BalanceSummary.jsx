import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const BalanceSummary = ({
  members = [],
  balances = {},
  currentUserId = null,
}) => {
  return (
    <View style={styles.bg}>
      <Text style={styles.title}>💰 Current Balances</Text>
      <View style={styles.grid}>
        {members.map((member) => {
          const balance = balances[member.userId] || 0;
          const isCurrentUser = member.userId === currentUserId;

          let balanceText = "Settled up";
          let pillStyle = styles.balanceNeutralPill;
          if (balance > 0) {
            balanceText = `₹${Math.abs(balance).toFixed(0)} to receive`;
            pillStyle = styles.balancePositivePill;
          } else if (balance < 0) {
            balanceText = `₹${Math.abs(balance).toFixed(0)} to pay`;
            pillStyle = styles.balanceNegativePill;
          }

          return (
            <View
              key={member?._id}
              style={[
                styles.memberCard,
                isCurrentUser && styles.currentUserHighlight,
              ]}
            >
              {/* Avatar */}
              {member.avatarUrl ? (
                <Image
                  source={{ uri: member.avatarUrl }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>
                    {member.userName?.[0]?.toUpperCase() || "?"}
                  </Text>
                </View>
              )}

              {/* Name */}
              <Text style={styles.name}>
                {member?.userName}
                {isCurrentUser && " (You)"}
              </Text>

              {/* Balance pill */}
              <View style={[styles.balancePill, pillStyle]}>
                <Text style={styles.balanceText}>{balanceText}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    backgroundColor: "#f0fdfb",
    padding: 16,
    borderRadius: 16,
    margin: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
    fontSize: 18,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  memberCard: {
    width: "48%",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  currentUserHighlight: {
    borderColor: "#38bdf8", // cyan border for current user
    borderWidth: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#bae6fd", // soft blue
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0369a1",
  },
  name: {
    fontWeight: "600",
    color: "#1e293b",
    fontSize: 15,
    marginBottom: 6,
    textAlign: "center",
  },
  balancePill: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  balanceText: {
    fontSize: 13,
    fontWeight: "500",
    color: "white",
  },
  balancePositivePill: {
    backgroundColor: "#16a34a",
  },
  balanceNegativePill: {
    backgroundColor: "#dc2626",
  },
  balanceNeutralPill: {
    backgroundColor: "#64748b",
  },
});

export default BalanceSummary;
