import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import SearchBar from "../components/SearchBar";
import Ionicons from "react-native-vector-icons/Ionicons";
import Constants from "expo-constants";
import { useDispatch, useSelector } from "react-redux";
import {
  addRecentlyViewed,
  clearSearchResults,
  fetchRecipes,
  fetchWeekRecipes,
} from "../store/slices/recipe";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchNotifications } from "../store/slices/notification";
import { getMealPlan } from "../store/slices/mealPlan";

export const Home = ({ navigation }) => {
  const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;
  const dispatch = useDispatch();

  const today = new Date().toLocaleString("en-US", { weekday: "short" });
  const { user, loading, error } = useSelector((state) => state.user);
  const { recipes, searchResults, weekRecipes } = useSelector(
    (state) => state.recipes
  );
  const mealPlan = useSelector((state) => state.mealPlan?.data);
  const todaysMeals = mealPlan?.meals?.[today];

  const handleCategoryPress = (category) => {
    navigation.navigate("Category", { category });
  };

  const handleDishClick = (recipeId, recipe) => {
    if (recipeId && recipe) {
      dispatch(addRecentlyViewed(recipe));
      navigation.navigate("Recipe", { recipeId });
    }
  };
  console.log("todays meals from redux", todaysMeals);
  useEffect(() => {
    const loadData = async () => {
      await dispatch(fetchRecipes());
      await dispatch(fetchWeekRecipes());
      await dispatch(fetchNotifications());
      await dispatch(getMealPlan());
      dispatch(clearSearchResults());
    };

    loadData();
  }, [dispatch]);

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
                source={{ uri: user.image }}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  borderWidth: 2,
                  borderColor: "teal",
                }}
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
                      ? { uri: recipe.image }
                      : require("../../assets/images/pasta.jpg")
                  }
                  style={styles.RecImg}
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
                source={{ uri: recipe.image }}
                style={styles.recipeWeekImg}
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
           {todaysMeals && (
        <View style={styles.mealPlanContainer}>
          <View style={styles.mealPlanHeader}>
            <Text style={styles.mealPlanTitle}>🍽️ Today's Meal Plan</Text>
            <Text style={styles.mealPlanDate}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>

          <View style={styles.mealGrid}>
            {["breakfast", "lunch", "dinner"].map((type) => {
              const recipe = todaysMeals[type];
              const icons = {
                breakfast: "🥞",
                lunch: "🍛",
                dinner: "🍽️",
              };

              return (
                <View key={type} style={styles.mealCard}>
                  <View style={styles.mealCardHeader}>
                    <Text style={styles.mealEmoji}>{icons[type]}</Text>
                    <Text style={styles.mealTypeText}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </View>

                  {recipe?._id ? (
                    <TouchableOpacity
                      style={styles.mealWithRecipe}
                      onPress={() => handleDishClick(recipe._id, recipe)}
                    >
                      <View style={styles.mealImageContainer}>
                        <Image
                          source={
                            recipe.image
                              ? { uri: recipe.image }
                              : require("../../assets/images/pasta.jpg")
                          }
                          style={styles.mealImage}
                        />
                        <View style={styles.mealImageOverlay}>
                          <Ionicons name="eye" size={18} color="#fff" />
                        </View>
                      </View>
                      <View style={styles.mealInfo}>
                        <Text style={styles.mealTitle} numberOfLines={1}>
                          {recipe.title}
                        </Text>
                        <Text style={styles.mealAuthor} numberOfLines={1}>
                          By {recipe.authorName || "Unknown"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.emptyMealCard}>
                      <Ionicons
                        name="alert-circle-outline"
                        size={28}
                        color="#cbd5e0"
                        style={styles.emptyMealIcon}
                      />
                      <Text style={styles.emptyMealText}>Not planned</Text>
                      <TouchableOpacity style={styles.addMealButton}>
                        <Text style={styles.addMealButtonText}>+ Add</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      )}

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
  mealCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mealPlanContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginTop: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  mealPlanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  mealPlanTitle: {
    fontSize: 22,
    fontFamily: "Primary-ExtraBold",
    color: "#2d3748",
  },

  mealPlanDate: {
    fontSize: 14,
    fontFamily: "Primary-Regular",
    color: "#718096",
  },

  mealGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 15,
  },

  mealCard: {
    width: "30%",
    backgroundColor: "#f8fafc",
    borderRadius: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  mealCardHeader: {
    alignItems: "center",
    marginBottom: 12,
  },

  mealEmoji: {
    fontSize: 28,
    marginBottom: 5,
  },

  mealTypeText: {
    fontSize: 14,
    fontFamily: "Primary-Bold",
    color: "#4a5568",
  },

  mealWithRecipe: {
    alignItems: "center",
  },

  mealImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
    marginBottom: 10,
    position: "relative",
  },

  mealImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  mealImageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  mealInfo: {
    alignItems: "center",
    width: "100%",
  },

  mealTitle: {
    fontSize: 12,
    fontFamily: "Primary-Bold",
    color: "#2d3748",
    textAlign: "center",
    marginBottom: 4,
  },

  mealAuthor: {
    fontSize: 10,
    fontFamily: "Primary-Regular",
    color: "#718096",
    textAlign: "center",
    marginBottom: 8,
  },

  mealStats: {
    alignItems: "center",
    gap: 2,
  },

  mealStatText: {
    fontSize: 9,
    fontFamily: "Primary-Regular",
    color: "#a0aec0",
  },

  emptyMealCard: {
    alignItems: "center",
    paddingVertical: 20,
  },

  emptyMealIcon: {
    marginBottom: 10,
  },

  emptyMealText: {
    fontSize: 12,
    fontFamily: "Primary-Regular",
    color: "#a0aec0",
    marginBottom: 10,
  },

  addMealButton: {
    backgroundColor: "#teal",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },

  addMealButtonText: {
    color: "white",
    fontSize: 10,
    fontFamily: "Primary-Bold",
  },
  mealScrollContainer: {
    marginTop: 15,
  },

  horizontalMealCard: {
    width: 280,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  mealCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  mealSubtitle: {
    fontSize: 11,
    fontFamily: "Primary-Regular",
    color: "#a0aec0",
    marginTop: 2,
  },

  mealCardRight: {
    flexDirection: "row",
    alignItems: "center",
    flex: 2,
  },

  horizontalMealImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },

  horizontalMealInfo: {
    flex: 1,
  },

  horizontalMealTitle: {
    fontSize: 14,
    fontFamily: "Primary-Bold",
    color: "#2d3748",
    marginBottom: 2,
  },

  horizontalMealAuthor: {
    fontSize: 11,
    fontFamily: "Primary-Regular",
    color: "#718096",
    marginBottom: 6,
  },

  horizontalMealBadge: {
    backgroundColor: "#e6fffa",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  badgeText: {
    fontSize: 9,
    fontFamily: "Primary-Bold",
    color: "teal",
  },

  emptyHorizontalMeal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 2,
  },

  quickAddButton: {
    backgroundColor: "#f0fff4",
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "teal",
  },
});
