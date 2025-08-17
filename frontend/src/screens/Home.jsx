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

      <View style={styles.mealPlanSection}>
        <View style={styles.mealPlanHeader}>
          <Text style={styles.mealPlanTitle}>Today's Meal Plan</Text>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color="#718096" />
            <Text style={styles.mealPlanDate}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mealScrollContainer}
          contentContainerStyle={styles.mealScrollContent}
        >
          {["breakfast", "lunch", "dinner"].map((type, index) => {
            const recipe = todaysMeals?.[type];
            const mealConfig = {
              breakfast: {
                icon: "sunny-outline",
                color: "#319795", // Main teal
                bgColor: "#E6FFFA", // Light teal background
                time: "8:00 AM",
              },
              lunch: {
                icon: "partly-sunny-outline",
                color: "#2C7A7B", // Darker teal
                bgColor: "#B2F5EA", // Medium teal background
                time: "12:30 PM",
              },
              dinner: {
                icon: "moon-outline",
                color: "#285E61", // Darkest teal
                bgColor: "#81E6D9", // Lighter teal background
                time: "7:00 PM",
              },
            };

            const config = mealConfig[type];

            return (
              <View
                key={type}
                style={[
                  styles.elegantMealCard,
                  { marginLeft: index === 0 ? 0 : 15 },
                ]}
              >
                {/* Header Section */}
                <View
                  style={[
                    styles.mealCardHeader,
                    { backgroundColor: config.bgColor },
                  ]}
                >
                  <View style={styles.mealHeaderTop}>
                    <View
                      style={[
                        styles.mealIconContainer,
                        { backgroundColor: config.color },
                      ]}
                    >
                      <Ionicons name={config.icon} size={20} color="white" />
                    </View>
                    <Text style={styles.mealTimeText}>{config.time}</Text>
                  </View>
                  <Text style={styles.elegantMealType}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </View>

                {/* Content Section */}
                {recipe?._id ? (
                  <TouchableOpacity
                    style={styles.mealContentWithRecipe}
                    onPress={() => handleDishClick(recipe._id, recipe)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.recipeImageContainer}>
                      <Image
                        source={
                          recipe.image
                            ? { uri: recipe.image }
                            : require("../../assets/images/pasta.jpg")
                        }
                        style={styles.elegantMealImage}
                      />
                      <View style={styles.recipeImageOverlay}>
                        <Ionicons name="play-circle" size={24} color="white" />
                      </View>
                    </View>

                    <View style={styles.recipeDetails}>
                      <Text style={styles.elegantRecipeTitle} numberOfLines={2}>
                        {recipe.title}
                      </Text>
                      <Text
                        style={styles.elegantRecipeAuthor}
                        numberOfLines={1}
                      >
                        By {recipe.authorName || "Unknown Chef"}
                      </Text>

                      <View style={styles.recipeMetrics}>
                        <View style={styles.metricItem}>
                          <Ionicons
                            name="time-outline"
                            size={14}
                            color="#64748B"
                          />
                          <Text style={styles.metricText}>
                            {recipe.cookTime || "30"} min
                          </Text>
                        </View>
                        <View style={styles.metricItem}>
                          <Ionicons
                            name="flame-outline"
                            size={14}
                            color="#64748B"
                          />
                          <Text style={styles.metricText}>
                            {recipe.calories || "250"} cal
                          </Text>
                        </View>
                      </View>

                      <View
                        style={[
                          styles.viewRecipeButton,
                          { backgroundColor: config.color },
                        ]}
                      >
                        <Text style={styles.viewRecipeText}>View Recipe</Text>
                        <Ionicons
                          name="arrow-forward"
                          size={14}
                          color="white"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.emptyMealContent}>
                    <View style={styles.emptyMealIcon}>
                      <Ionicons
                        name="add-circle-outline"
                        size={48}
                        color="#CBD5E1"
                      />
                    </View>
                    <Text style={styles.emptyMealTitle}>No meal planned</Text>
                    <Text style={styles.emptyMealSubtitle}>
                      Tap to add a recipe for {type}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.addMealButtonElegant,
                        { backgroundColor: config.color },
                      ]}
                      activeOpacity={0.8}
                      onPress={() => handleCategoryPress(type)}
                    >
                      <Ionicons name="add" size={16} color="white" />
                      <Text style={styles.addMealText}>Add Meal</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
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
    textAlign: "left",
    fontFamily: "Primary-ExtraBold",
    fontSize: 12,
    color: "white",
  },
  ownerText: {
    textAlign: "right",
    fontFamily: "Primary-Regular",
    fontSize: 10,
    color:"black"
  },
  ownerTextInRecipesWeek: {
    textAlign: "right",
    fontFamily: "Primary-Regular",
    fontSize: 10,
    color:"white"
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
    paddingHorizontal: 5,
  },
  mealPlanTitle: {
    fontSize: 22,
    fontFamily: "Primary-ExtraBold",
    color: "#1F2937",
  },
  mealPlanDate: {
    fontSize: 13,
    fontFamily: "Primary-Medium",
    color: "#64748B",
  },
  mealGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 15,
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
    opacity: 0.7,
  },
  emptyMealText: {
    fontSize: 14,
    color: "#a0aec0",
    fontFamily: "Primary-Regular",
  },
  addMealButton: {
    backgroundColor: "#319795",
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
    paddingVertical: 5,
  },
  horizontalMealCard: {
    width: 300,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 15,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  mealCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  mealEmoji: {
    fontSize: 34,
    marginRight: 10,
  },
  mealTypeText: {
    fontSize: 16,
    fontFamily: "Primary-Bold",
    color: "#2d3748",
  },
  mealSubtitle: {
    fontSize: 12,
    fontFamily: "Primary-Regular",
    color: "#718096",
  },
  mealCardRight: {
    flexDirection: "row",
    alignItems: "center",
    flex: 2,
  },
  horizontalMealImage: {
    width: 55,
    height: 55,
    borderRadius: 15,
    marginRight: 12,
  },
  horizontalMealInfo: {
    flex: 1,
  },
  horizontalMealTitle: {
    fontSize: 15,
    fontFamily: "Primary-Bold",
    color: "#1a202c",
  },
  horizontalMealAuthor: {
    fontSize: 12,
    fontFamily: "Primary-Regular",
    color: "#718096",
  },
  horizontalMealBadge: {
    backgroundColor: "#e6fffa",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: "Primary-Bold",
    color: "#319795",
  },
  emptyHorizontalMeal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 2,
  },
  quickAddButton: {
    backgroundColor: "#319795",
    padding: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mealPlanSection: {
    marginTop: 30,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  mealScrollContent: {
    paddingHorizontal: 5,
  },
  elegantMealCard: {
    width: 180,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  mealCardHeader: {
    padding: 12,
    paddingBottom: 10,
  },
  mealHeaderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  mealIconContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  mealTimeText: {
    fontSize: 12,
    fontFamily: "Primary-Medium",
    color: "#64748B",
  },
  elegantMealType: {
    fontSize: 15,
    fontFamily: "Primary-ExtraBold",
    color: "#1F2937",
    textTransform: "capitalize",
  },
  mealContentWithRecipe: {
    padding: 12,
    paddingTop: 0,
  },
  recipeImageContainer: {
    width: "100%",
    height: 85,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
    position: "relative",
  },
  elegantMealImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  recipeImageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  recipeDetails: {
    gap: 6,
  },
  elegantRecipeTitle: {
    fontSize: 14,
    fontFamily: "Primary-Bold",
    color: "#1F2937",
    lineHeight: 18,
  },
  elegantRecipeAuthor: {
    fontSize: 11,
    fontFamily: "Primary-Regular",
    color: "#64748B",
  },
  recipeMetrics: {
    flexDirection: "row",
    gap: 12,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metricText: {
    fontSize: 10,
    fontFamily: "Primary-Medium",
    color: "#64748B",
  },
  viewRecipeButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 5,
    marginTop: 2,
  },
  viewRecipeText: {
    fontSize: 12,
    fontFamily: "Primary-Bold",
    color: "white",
  },
  emptyMealContent: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  emptyMealTitle: {
    fontSize: 13,
    fontFamily: "Primary-Bold",
    color: "#64748B",
    marginBottom: 4,
  },
  emptyMealSubtitle: {
    fontSize: 10,
    fontFamily: "Primary-Regular",
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 14,
  },
  addMealButtonElegant: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  addMealText: {
    fontSize: 11,
    fontFamily: "Primary-Bold",
    color: "white",
  },
});
