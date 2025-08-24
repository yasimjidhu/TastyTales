import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import * as Linking from "expo-linking";

// Screens
import { Home } from "../screens/Home";
import BookMark from "../screens/BookMark";
import Recipe from "../screens/Recipe";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import Account from "../screens/Account";
import AddRecipe from "../screens/AddRecipe";
import CookingStepsScreen from "../screens/CookingStepScreen";
import Category from "../screens/Category";
import ViewAll from "../screens/ViewAll";
import RecipeSuggester from "../screens/RecipeSuggester";
import NotificationsScreen from "../screens/NotificationScreen";
import GroceryListScreen from "../screens/GroceryListScreen";
import MealPlanner from "../screens/mealPlanner";
import Preferences from "../screens/PreferenceWizard";

// Shared Kitchen Screens
import KitchenHomeScreen from "../screens/KitchenHomeScreen";
import KitchenSetupScreen from "../screens/kitchenSetup";
import InventoryScreen from "../screens/Inventory";
import ExpensesScreen from "../screens/Expenses";
import ScheduleScreen from "../screens/Schedule";
import MembersScreen from "../screens/Members";

// New Join/Create Kitchen Screens
import JoinKitchenScreen from "../screens/JoinKitchen";
import KitchenChoiceScreen from "../screens/kitchenChoice"; // NEW

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  const { unreadCount } = useSelector((state) => state.notifications);
  const { list } = useSelector((state) => state.grocery);
  const { user } = useSelector((state) => state.user);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Suggest":
              iconName = focused ? "restaurant" : "restaurant-outline";
              break;
            case "Add":
              iconName = "add";
              break;
            case "Bookmarks":
              iconName = focused ? "bookmarks" : "bookmarks-outline";
              break;
            case "Account":
              iconName = focused ? "person" : "person-outline";
              break;
          }

          if (route.name === "Add") {
            return (
              <View style={styles.plusButton}>
                <Ionicons name={iconName} size={size} color="white" />
              </View>
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: route.name === "Add" ? "" : route.name,
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#6B7280",
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center", marginRight: 15 }}>
              {/* Kitchen Icon */}
              <View style={{ marginRight: 20 }}>
                <Ionicons
                  name="restaurant-outline"
                  size={24}
                  onPress={() => {
                    if (user?.kitchen) {
                      navigation.navigate("KitchenHome");  // ✅ user already in a kitchen
                    } else {
                      navigation.navigate("KitchenChoice"); // ✅ no kitchen yet
                    }
                  }}
                />
              </View>

              {/* Grocery Icon */}
              <View style={{ marginRight: 20 }}>
                <Ionicons
                  name="cart-outline"
                  size={24}
                  onPress={() => navigation.navigate("Grocery")}
                />
                {list?.length > 0 && (
                  <View style={[styles.badge, { right: -10, top: -8 }]}>
                    <Text style={styles.badgeText}>{list.length}</Text>
                  </View>
                )}
              </View>

              {/* Notifications Icon */}
              <View style={{ marginRight: 20 }}>
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  onPress={() => navigation.navigate("Notifications")}
                />
                {unreadCount > 0 && (
                  <View style={[styles.badge, { right: -10, top: -8 }]}>
                    <Text style={styles.badgeText}>{unreadCount}</Text>
                  </View>
                )}
              </View>
            </View>
          ),
        })}
      />
      <Tab.Screen name="Suggest" component={RecipeSuggester} />
      <Tab.Screen name="Add" component={AddRecipe} />
      <Tab.Screen name="Bookmarks" component={BookMark} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  const { user } = useSelector((state) => state.user);
  return (
    <Stack.Navigator>
      {!user && <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />}
      {!user && <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />}
      {user && !user.preferencesCompleted && (
        <Stack.Screen name="Preferences" component={Preferences} options={{ title: "Preferences" }} />
      )}
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Recipe" component={Recipe} options={{ title: "Recipe Details", headerBackTitle: "Back" }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: "Notifications" }} />
      <Stack.Screen name="CookingSteps" component={CookingStepsScreen} />
      <Stack.Screen name="Category" component={Category} />
      <Stack.Screen name="ViewAll" component={ViewAll} />
      <Stack.Screen name="Grocery" component={GroceryListScreen} />
      <Stack.Screen name="MealPlanner" component={MealPlanner} options={{ title: "Meal Planner" }} />

      {/* Kitchen flow */}
      <Stack.Screen name="KitchenChoice" component={KitchenChoiceScreen} options={{ title: "Join or Create Kitchen" }} />
      <Stack.Screen name="KitchenSetup" component={KitchenSetupScreen} options={{ title: "Setup Your Kitchen" }} />
      <Stack.Screen name="JoinKitchen" component={JoinKitchenScreen} options={{ title: "Join Kitchen" }} />
      <Stack.Screen name="KitchenHome" component={KitchenHomeScreen} options={{ title: "Shared Kitchen Manager" }} />
      <Stack.Screen name="Inventory" component={InventoryScreen} options={{ title: "Inventory" }} />
      <Stack.Screen name="Expenses" component={ExpensesScreen} options={{ title: "Expenses" }} />
      <Stack.Screen name="Schedule" component={ScheduleScreen} options={{ title: "Cooking Schedule" }} />
      <Stack.Screen name="Members" component={MembersScreen} options={{ title: "Kitchen Members" }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useSelector((state) => state.user);
  return user?.preferencesCompleted ? <MainStack /> : <AuthStack />;
}

const styles = StyleSheet.create({
  plusButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "teal",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  badge: {
    position: "absolute",
    backgroundColor: "red",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
