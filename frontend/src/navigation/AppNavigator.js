import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from "../context/authContext";

import { Home } from "../screens/Home";
import BookMark from "../screens/BookMark";
import Recipe from "../screens/Recipe";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import Account from "../screens/Account";
import AddRecipe from "../screens/AddRecipe";
import { useSelector } from "react-redux";
import CookingStepsScreen from "../screens/CookingStepScreen";
import Category from "../screens/Category";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Add') iconName = 'add';
          else if (route.name === 'Bookmarks') iconName = focused ? 'bookmarks' : 'bookmarks-outline';
          else if (route.name === 'Account') iconName = focused ? 'person' : 'person-outline';
          
          // Special styling for the Add button
          if (route.name === 'Add') {
            return (
              <View style={styles.plusButton}>
                <Ionicons name={iconName} size={size} color="white" />
              </View>
            );
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: ({ focused }) => {
          // Hide label for the Add button to make it cleaner
          if (route.name === 'Add') return '';
          return route.name;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Recipe} />
      <Tab.Screen name="Add" component={AddRecipe} />
      <Tab.Screen name="Bookmarks" component={BookMark} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}

function MainStack(){
  return(
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Recipe" component={Recipe} options={{title:'Recipe Details',headerBackTitle:'Back'}} />
      <Stack.Screen name="CookingSteps" component={CookingStepsScreen} />
      <Stack.Screen name="Category" component={Category}/>
    </Stack.Navigator>

  )
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
    fontWeight:'extrabold',
    backgroundColor: 'teal',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});