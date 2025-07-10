import React, { useCallback, useEffect, useState } from "react";
import { Image } from 'expo-image';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import SearchBar from "../components/SearchBar";
import Ionicons from "react-native-vector-icons/Ionicons";
import Constants from "expo-constants";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../store/slices/user";

import {
  addRecentlyViewed,
  clearSearchResults,
  fetchRecipes,
  fetchWeekRecipes,
} from "../store/slices/recipe";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  fetchNotifications,
  updateExpoToken,
} from "../store/slices/notification";
import { registerForPushNotificationsAsync } from "../notifications/registerPushToken";
import { useFocusEffect } from "@react-navigation/native";
import { RefreshControl } from "react-native-gesture-handler";

export const Home = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector((state) => state.user);
  const { recipes, searchResults, weekRecipes, lastFetched, weekLastFetched } =
    useSelector((state) => state.recipes);

  const handleCategoryPress = (category) => {
    navigation.navigate("Category", { category });
  };

  const handleDishClick = (recipeId, recipe) => {
    if (recipeId && recipe) {
      dispatch(addRecentlyViewed(recipe));
      navigation.navigate("Recipe", { recipeId });
    }
  };

  const shouldFetch = (data = [], lastFetched = null, maxAgeInMinutes = 10) => {
    if (!lastFetched) return true;
    if (data.length === 0) return true; // No data → fetch
    const age = Date.now() - lastFetched;
    return age > maxAgeInMinutes * 60 * 1000; // Older than 10 min → fetch
  };
  console.log("recipes length", recipes.length);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        if (shouldFetch(recipes, lastFetched)) {
          await dispatch(fetchRecipes());
        }

        if (shouldFetch(weekRecipes, weekLastFetched)) {
          await dispatch(fetchWeekRecipes());
        }

        await dispatch(fetchNotifications());
        dispatch(clearSearchResults());
      };

      loadData();
    }, [dispatch, recipes, lastFetched, weekRecipes, weekLastFetched])
  );

  const handleProfileClick = () => {
    navigation.navigate("Account");
  };
  const displayedRecipes = searchResults.length ? searchResults : recipes;

  {
    loading && <LoadingSpinner message="Fetching Recipes..." />;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.flexRow}>
        <View style={styles.welcomeDiv}>
          <Text style={{ fontFamily: "Primary-Regular", fontSize: 24 }}>
            Hello{" "}
            <Text style={styles.userName}>{user?.name?.toUpperCase()}</Text>
          </Text>
          <Text style={{ fontFamily: "Primary-ExtraBold", fontSize: 24 }}>
            What would you like
          </Text>
          <Text style={{ fontFamily: "Primary-ExtraBold", fontSize: 24 }}>
            to cook today?
          </Text>
        </View>
        <TouchableOpacity onPress={handleProfileClick}>
          <View style={styles.profileDiv}>
            {user?.image ? (
              <Image
                source={user.image}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  borderWidth: 2,
                  borderColor: "teal",
                }}
                contentFit="cover"
                transition={300}
              />
            ) : (
              <Ionicons name="person-circle-outline" size={70} color="white" />
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar Section */}
      <SearchBar />

      {/* Categories Section with Horizontal Scrolling */}
      <View style={styles.categoriesContainer}>
        <View style={styles.flexRow}>
          <Text style={styles.categoryHeading}>Categories</Text>
        </View>

        {/* Horizontal ScrollView for Category Boxes */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryBoxContainer}
        >
          <TouchableOpacity
            style={styles.categoryBox}
            onPress={() => handleCategoryPress("breakfast")}
          >
            <Image
              source={require("../../assets/images/breakFast.png")}
              style={styles.categoryImage}
            />
            <Text style={styles.categoryText}>BreakFast</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoryBox}
            onPress={() => handleCategoryPress("lunch")}
          >
            <Image
              source={require("../../assets/images/lunch.png")}
              style={styles.categoryImage}
            />
            <Text style={styles.categoryText}>Lunch</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoryBox}
            onPress={() => handleCategoryPress("dinner")}
          >
            <Image
              source={require("../../assets/images/dinner.png")}
              style={styles.categoryImage}
            />
            <Text style={styles.categoryText}>Dinner</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoryBox}
            onPress={() => handleCategoryPress("dessert")}
          >
            <Image
              source={require("../../assets/images/dessert.png")}
              style={styles.categoryImage}
            />
            <Text style={styles.categoryText}>Dessert</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Recommendation Section */}
      <View style={styles.recommendationContainer}>
        <View style={styles.flexRow}>
          <Text style={styles.categoryHeading}>
            {searchResults?.length > 0 ? "Search Results" : "Recommendations"}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.recBoxContainer}
        >
          {displayedRecipes.map((recipe) => (
            <TouchableOpacity
              key={recipe._id}
              onPress={() => handleDishClick(recipe._id, recipe)}
            >
              <View style={styles.recImgContainer}>
                <Image
                  source={
                    recipe.image
                      ? recipe.image
                      : require("../../assets/images/pasta.jpg")
                  }
                  style={styles.RecImg}
                  contentFit="cover"
                  transition={500}
                />
              </View>
              <View style={styles.recTextContainer}>
                <Text style={styles.recipeText}>
                  {recipe.title || "Untitled"}
                </Text>
                <Text style={styles.ownerText}>
                  {recipe.authorName || "By Unknown"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recipes of the week section */}
      <Text style={styles.categoryHeading}>Recipes of the Week</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {weekRecipes?.map((recipe) => (
          <TouchableOpacity
            key={recipe._id}
            onPress={() =>
              navigation.navigate("Recipe", { recipeId: recipe._id })
            }
          >
            <View key={recipe._id} style={styles.recipeWeekImgContainer}>
              <Image
                source={recipe.image}
                style={styles.recipeWeekImg}
                contentFit="cover"
                transition={500}
              />
              <View style={styles.textOverlay}>
                <Text style={styles.weekRecipeText}>{recipe.title}</Text>
                <Text style={styles.ownerTextInRecipesWeek}>
                  By {recipe.author || "Unknown"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileDiv: {
    backgroundColor: "gray",
    height: 70,
    width: 70,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontFamily: "Primary-Bold",
    fontSize: 24,
    color: "teal",
  },
  categoriesContainer: {
    marginTop: 25,
  },
  categoryHeading: {
    fontFamily: "Primary-Bold",
    fontSize: 20,
  },
  seeAll: {
    fontFamily: "Primary-Bold",
    fontSize: 16,
    color: "teal",
  },
  categoryBoxContainer: {
    marginTop: 20,
    flexDirection: "row",
  },
  categoryBox: {
    height: 80,
    width: 90,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8FF",
    borderRadius: 15,
    marginRight: 5,
  },
  categoryImage: {
    width: "70%",
    height: "70%",
    borderRadius: 15,
  },
  categoryText: {
    textAlign: "center",
    color: "black",
    fontFamily: "Primary-Bold",
  },
  recommendationContainer: {
    marginTop: 30,
  },
  recBoxContainer: {
    marginTop: 10,
    flexDirection: "row",
  },
  recImgContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: 140,
    width: 140,
    backgroundColor: "#F8F8FF",
    borderRadius: 15,
    marginRight: 10,
    overflow: "hidden",
  },
  RecImg: {
    width: "100%",
    height: "100%",
  },
  recipeText: {
    fontFamily: "Primary-Bold",
    fontSize: 16,
  },
  recTextContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 5,
  },
  recipeWeekContainer: {
    marginTop: 1,
    backgroundColor: "",
  },
  recipeWeekImgContainer: {
    height: 150,
    width: 300,
    backgroundColor: "teal",
    borderRadius: 15,
    marginRight: 15,
    position: "relative",
    marginTop: 5,
  },
  recipeWeekImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 15,
  },
  textOverlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: "auto",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  weekRecipeText: {
    color: "white",
    textAlign: "left",
    fontFamily: "Primary-ExtraBold",
    fontSize: 12,
  },
  ownerText: {
    color: "black",
    textAlign: "right",
    fontFamily: "Primary-Regular",
    fontSize: 10,
  },
  ownerTextInRecipesWeek: {
    color: "white",
    textAlign: "right",
    fontFamily: "Primary-Regular",
    fontSize: 10,
  },
});
