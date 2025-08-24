import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BalanceSummary = ({ members = [], balances = [] }) => {
  return (
    <View style={styles.bg}>
      <Text style={styles.title}>Current Balances</Text>
      <View style={styles.grid}>
        {members &&
          members.length > 0 &&
          members.map((member) => {
            const balance = balances[member.userId] || 0;
            let balanceStyle = styles.balanceNeutral;
            if (balance > 0) balanceStyle = styles.balancePositive;
            else if (balance < 0) balanceStyle = styles.balanceNegative;

            return (
              <View key={member?._id} style={styles.memberCard}>
                <Text style={styles.name}>{member?.userName}</Text>
                <Text style={[styles.balance, balanceStyle]}>
                  ₹{Math.abs(balance).toFixed(0)}
                  {balance > 0
                    ? " to receive"
                    : balance < 0
                    ? " to pay"
                    : " settled up"}
                </Text>
              </View>
            );
          })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    backgroundColor: "#f0fdfb", // soft blue/green gradient substitute
    padding: 16,
    borderRadius: 12,
    margin: 12,
  },
  title: {
    fontWeight: "600",
    color: "#22223b",
    marginBottom: 12,
    fontSize: 18,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "flex-start",
  },
  memberCard: {
    width: "48%", // for 2 columns; adjust for more
    minWidth: 120,
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#edf2f7",
  },
  name: {
    fontWeight: "500",
    color: "#22223b",
    marginBottom: 6,
    fontSize: 15,
  },
  balance: {
    fontSize: 17,
    fontWeight: "bold",
  },
  balancePositive: {
    color: "#16a34a", // green-600
  },
  balanceNegative: {
    color: "#dc2626", // red-600
  },
  balanceNeutral: {
    color: "#64748b", // gray-600
  },
});

export default BalanceSummary;
