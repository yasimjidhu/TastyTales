import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { addRecentlyViewed } from "../store/slices/recipe";

export default function ListRecipes({ recipes, fetchMore }) {
  const navigation = useNavigation();
  const dispatch = useDispatch()

  const handleDishClick = (id,recipe) => {
    if (id && recipe) {
      dispatch(addRecentlyViewed(recipe))
      navigation.navigate("Recipe", { recipeId: id });
    } else {
      console.warn("Recipe ID is not available");
    }
  };

  const handleScroll = (event) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const isEndReached =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;

    if (isEndReached) {
      console.log("End reached, fetching more recipes...");
      fetchMore();
    }
  };
  return (
    <View style={styles.recommendationContainer}>
      <View style={styles.flexRow}></View>
      <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        <View style={styles.gridContainer}>
          {recipes?.map((recipe, index) => (
            <TouchableOpacity
              key={`${recipe._id}_${index}`}
              onPress={() => handleDishClick(recipe._id,recipe)}
              style={styles.cardContainer}
            >
              <View style={styles.recImgContainer}>
                <Image
                  source={
                    recipe?.image
                      ? { uri: recipe.image }
                      : require("../../assets/images/pasta.jpg")
                  }
                  style={styles.RecImg}
                />
              </View>
              <View style={styles.recTextContainer}>
                <Text style={styles.recipeText}>
                  {recipe?.title || "Untitled"}
                </Text>
                {/* Show match percentage if available */}
                {recipe.matchPercentage !== undefined && (
                  <Text style={styles.matchText}>
                    Match: {recipe.matchPercentage}%
                  </Text>
                )}
                <Text style={styles.ownerText}>
                  {recipe?.author || "By Unknown"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  recommendationContainer: {
    padding: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  cardContainer: {
    width: "48%", // Roughly half the screen with some spacing
    marginBottom: 15,
    backgroundColor: "#F8F8FF",
    borderRadius: 15,
    overflow: "hidden",
  },
  recImgContainer: {
    height: 140,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },

  RecImg: {
    width: "100%",
    height: "100%",
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  recBoxContainer: {
    marginTop: 10,
    flexDirection: "row",
  },
  recipeText: {
    fontFamily: "Primary-Bold",
    fontSize: 18,
  },
  recTextContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 5,
  },
  ownerText: {
    fontFamily: "Primary-Regular",
    color: "black",
    fontSize: 16,
  },
  matchText: {
  fontFamily: "Primary-Regular",
  color: "green",
  fontSize: 15,
  marginTop: 2,
},
});
