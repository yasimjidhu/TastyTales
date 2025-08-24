import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const KitchenChoiceScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Shared Kitchen</Text>
      <Text style={styles.subtitle}>Do you want to create a new kitchen or join an existing one?</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("KitchenSetup")}
      >
        <Text style={styles.buttonText}>➕ Create Kitchen</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate("JoinKitchen")}
      >
        <Text style={styles.buttonText}>🔑 Join Kitchen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonSecondary: {
    backgroundColor: "#10B981",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default KitchenChoiceScreen;
