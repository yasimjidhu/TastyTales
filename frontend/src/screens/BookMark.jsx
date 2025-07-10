import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addRecentlyViewed, fetchSavedRecipes } from "../store/slices/recipe";

export default function BookMark({ navigation }) {
  const dispatch = useDispatch();
  const { recentlyViewed, madeIt, savedRecipes } =
    useSelector((state) => state.recipes);

  const handleDishClick = (id, recipe) => {
    if (id && recipe) {
      dispatch(addRecentlyViewed(recipe));
      navigation.navigate("Recipe", { recipeId: id });
    } else {
      console.warn("Recipe ID is not available");
    }
  };

  useEffect(() => {
    dispatch(fetchSavedRecipes());
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Recently Viewed Section */}
      <View style={styles.recentContainer}>
        <View style={styles.recentTextDiv}>
          <Text style={styles.miniHeading}>Recently Viewed</Text>
        </View>

        {recentlyViewed.length === 0 ? (
          <Text style={{ marginLeft: 15, marginTop: 10, color: "gray" }}>
            No recently viewed recipes.
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginLeft: 15 }}
          >
            {recentlyViewed.map((recipe) => (
              <TouchableOpacity
                key={recipe._id}
                onPress={() => handleDishClick(recipe._id, recipe)}
                style={styles.recentImgContainer}
              >
                <Image
                  source={{ uri: recipe.image }}
                  style={styles.recentImg}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Made It Section */}
      <View style={styles.madeItContainer}>
        <View style={styles.recentTextDiv}>
          <Text style={styles.miniHeading}>Made It</Text>
        </View>

        {madeIt.length === 0 ? (
          <Text style={{ marginLeft: 15, marginTop: 10, color: "gray" }}>
            No recipes marked as made.
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginLeft: 15 }}
          >
            {madeIt.slice(0, 3).map((recipe, index) => (
              <TouchableOpacity
                key={recipe._id}
                onPress={() => {
                  if (index === 2 && madeIt.length > 3) {
                    navigation.navigate("ViewAll", {
                      recipesIds: madeIt.map((r) => r._id),
                    });
                  } else {
                    handleDishClick(recipe._id, recipe);
                  }
                }}
                style={styles.recentImgContainer}
              >
                <Image
                  source={{ uri: recipe.image }}
                  style={styles.recentImg}
                />

                {index === 2 && madeIt.length > 3 && (
                  <View style={styles.overlay}>
                    <Text style={styles.overlayText}>
                      {madeIt.length - 3} + Recipes
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Saved Recipes Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Recipes</Text>
          {savedRecipes && savedRecipes.length > 3 && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ViewAll", {
                  recipesIds: savedRecipes.map((recipe) => recipe._id),
                })
              }
              style={styles.seeAllButton}
            >
            </TouchableOpacity>
          )}
        </View>

        {!savedRecipes || savedRecipes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💾</Text>
            <Text style={styles.emptyText}>
              No saved recipes yet. Save your favorite recipes!
            </Text>
          </View>
        ) : (
          <View style={styles.breakfastContainer}>
            <TouchableOpacity
              style={styles.mainBreakfastCard}
              onPress={() =>
                handleDishClick(
                  savedRecipes[0]._id || savedRecipes[0].id,
                  savedRecipes[0]
                )
              }
              activeOpacity={0.8}
            >
              <Image
                source={{
                  uri: savedRecipes[0].image || savedRecipes[0].imageUrl,
                }}
                style={styles.staticRecipeImage}
                resizeMode="cover"
              />
              <View style={styles.recipeCardShadow} />
            </TouchableOpacity>

            <View style={styles.sideCardsContainer}>
              {savedRecipes[1] && (
                <TouchableOpacity
                  style={styles.sideCard}
                  onPress={() =>
                    handleDishClick(
                      savedRecipes[1]._id || savedRecipes[1].id,
                      savedRecipes[1]
                    )
                  }
                  activeOpacity={0.8}
                >
                  <Image
                    source={{
                      uri: savedRecipes[1].image || savedRecipes[1].imageUrl,
                    }}
                    style={styles.staticRecipeImage}
                    resizeMode="cover"
                  />
                  <View style={styles.recipeCardShadow} />
                </TouchableOpacity>
              )}

              {savedRecipes[2] && (
                <TouchableOpacity
                  style={styles.sideCard}
                  onPress={() => {
                    if (savedRecipes.length > 3) {
                      navigation.navigate("ViewAll", {
                        recipesIds: savedRecipes.map((r) => r._id),
                      });
                    } else {
                      handleDishClick(
                        savedRecipes[2]._id || savedRecipes[2].id,
                        savedRecipes[2]
                      );
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{
                      uri: savedRecipes[2].image || savedRecipes[2].imageUrl,
                    }}
                    style={styles.staticRecipeImage}
                    resizeMode="cover"
                  />
                  {savedRecipes.length > 3 && (
                    <View style={styles.overlay}>
                      <Text style={styles.overlayText}>
                        {savedRecipes.length - 3}+ Recipes
                      </Text>
                    </View>
                  )}
                  <View style={styles.recipeCardShadow} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  recentContainer: {
    marginTop: 25,
  },
  miniHeading: {
    fontFamily: "Primary-Bold",
    fontSize: 20,
  },
  seeall: {
    fontFamily: "Primary-Bold",
    fontSize: 16,
    color: "teal",
  },
  recentTextDiv: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
  },
  recentImgContainer: {
    width: 120,
    height: 150,
    marginRight: 10,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "teal",
  },
  recentImg: {
    width: "100%",
    height: "100%",
  },
  madeItContainer: {
    marginTop: 25,
  },
  recentItemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginHorizontal: 15,
  },
  recentMiniImgContainer: {
    width: "35%",
    height: 150,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  recentMiniItem: {
    flex: 1,
    backgroundColor: "lightcoral",
    borderRadius: 15,
    marginBottom: 8,
    overflow: "hidden",
  },
  recentMiniImg1: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  overlayText: {
    color: "white",
    fontFamily: "Primary-ExtraBold",
    fontSize: 15,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: "Primary-Bold",
    fontSize: 24,
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#e8f5f3",
  },
  seeAllText: {
    fontFamily: "Primary-Bold",
    fontSize: 14,
    color: "#00796b",
  },
  breakfastContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    height: 200,
    gap: 12,
  },
  mainBreakfastCard: {
    flex: 2,
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  sideCardsContainer: {
    flex: 1,
    gap: 12,
  },
  sideCard: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  staticRecipeImage: {
    width: "100%",
    height: "100%",
  },
  recipeCardShadow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#f0f0f0",
    borderStyle: "dashed",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontFamily: "Primary-Regular",
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  overlayText: {
    color: "#fff",
    fontFamily: "Primary-ExtraBold",
    fontSize: 16,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
