import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
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
import GroceryListScreen from "../screens/GroceryListScreen";
import MealPlanner from "../screens/mealPlanner";
import Preferences from "../screens/PreferenceWizard";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  const { unreadCount } = useSelector((state) => state.notifications);
  const { list } = useSelector((state) => state.grocery);

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
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center", marginRight: 15 }}>
              {/* Cart Icon with Badge */}
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

              {/* Notifications Icon with Badge */}
              <View>
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

              {/* Theme Toggle Icon (Moon/Sun) */}
            </View>
          )
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
  console.log('user in AuthStack:', user);
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
      <Stack.Screen name="ViewAll" component={ViewAll} options={{ title: "Recipes you have made", headerBackTitle: "Back" }} />
      <Stack.Screen name="Grocery" component={GroceryListScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useSelector((state) => state.user);

  return (
    <NavigationContainer  key={user?.preferencesCompleted ? "main" : "auth"} >
      {user?.preferencesCompleted ? <MainStack /> : <AuthStack />}
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
