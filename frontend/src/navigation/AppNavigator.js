import React from "react";
import { View, Text, StyleSheet } from "react-native"; // Added Text import
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";

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

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  const { unreadCount } = useSelector((state) => state.notifications);

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
            default:
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
        tabBarActiveTintColor: "teal",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          headerRight: () => (
            <View style={{ marginRight: 15 }}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="black"
                onPress={() => navigation.navigate("Notifications")}
              />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
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
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
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
      <Stack.Screen name="ViewAll" component={ViewAll} options={{ title: "Recipes you have made", headerBackTitle: "Back" }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useSelector((state) => state.user);

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
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
    right: -6,
    top: -3,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});