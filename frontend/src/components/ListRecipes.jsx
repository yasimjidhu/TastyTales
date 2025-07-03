import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { addRecentlyViewed } from "../store/slices/recipe";

export default function ListRecipes({ recipes, fetchMore }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleDishClick = (id, recipe) => {
    if (id && recipe) {
      dispatch(addRecentlyViewed(recipe));
      navigation.navigate("Recipe", { recipeId: id });
    }
  };

  const handleEndReached = () => {
    console.log("End reached, fetching more recipes...");
    fetchMore();
  };

  return (
    <View style={styles.recommendationContainer}>
      <View style={styles.flexRow}></View>
      <FlatList
        data={recipes}
        numColumns={2}
        keyExtractor={(item, index) => `${item._id}_${index}`}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={`${item._id}_${index}`}
            onPress={() => handleDishClick(item._id, item)}
            style={styles.cardContainer}
          >
            <View style={styles.recImgContainer}>
              <Image
                source={
                  item?.image
                    ? { uri: item.image }
                    : require("../../assets/images/pasta.jpg")
                }
                style={styles.RecImg}
              />
            </View>
            <View style={styles.recTextContainer}>
              <Text style={styles.recipeText}>{item?.title || "Untitled"}</Text>
              {item.matchPercentage !== undefined && (
                <Text style={styles.matchText}>
                  Match: {item.matchPercentage}%
                </Text>
              )}
              <Text style={styles.ownerText}>
                {item?.userName || "By Unknown"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.gridContainer}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        scrollEventThrottle={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  recommendationContainer: {
    padding: 10,
  },
  gridContainer: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  cardContainer: {
    width: "48%",
    marginBottom: 15,
    backgroundColor: "#F8F8FF",
    borderRadius: 15,
    overflow: "hidden",
    marginHorizontal: "1%",
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
