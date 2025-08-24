import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard"; // for copying to clipboard
import * as Linking from "expo-linking";

// Import components
import InventoryScreen from "./Inventory";
import ExpensesScreen from "./Expenses";
import ScheduleScreen from "./Schedule";
import MembersScreen from "./Members";
import { useDispatch, useSelector } from "react-redux";
import { clearKitchen, fetchKitchen } from "../store/slices/kitchen";

const Tab = createMaterialTopTabNavigator();

const KitchenHomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { loading, kitchen } = useSelector((state) => state.kitchen);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user?.kitchen) return; // Case 2: user has no kitchen → do nothing

    // Case 1: user has kitchen, but it's not in store or mismatched
    if (!kitchen || kitchen._id !== user.kitchen) {
      dispatch(fetchKitchen(user.kitchen));
    }
  }, [user?.kitchen, kitchen, dispatch]);

  return (
    <View style={styles.container}>
      {/* Header with add kitchen */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{kitchen?.name}</Text>
        <TouchableOpacity
          onPress={async () => {
            if (!kitchen?.inviteCode) return;

            // Generate full deep link
            const inviteLink = Linking.createURL(
              `/invite/${kitchen.inviteCode}`
            );

            // Copy to clipboard
            await Clipboard.setStringAsync(inviteLink);

            // Optionally alert the user
            Alert.alert(
              "Copied!",
              "Invite link copied to clipboard:\n" + inviteLink
            );
          }}
          style={styles.copyButton}
        >
          <Ionicons name="copy-outline" size={28} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigator */}
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" },
          tabBarStyle: { backgroundColor: "white" },
          tabBarActiveTintColor: "#3B82F6",
          tabBarInactiveTintColor: "#6B7280",
        }}
      >
        <Tab.Screen
          name="Inventory"
          component={InventoryScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="cube-outline" size={16} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Expenses"
          component={ExpensesScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="cash-outline" size={16} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Schedule"
          component={ScheduleScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="calendar-outline" size={16} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Members"
          component={MembersScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="people-outline" size={16} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  addButton: {
    padding: 4,
  },
  copyButton: {
    padding: 4,
    marginLeft: 10,
  },
});

export default KitchenHomeScreen;
