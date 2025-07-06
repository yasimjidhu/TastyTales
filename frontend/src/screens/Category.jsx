import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import ListRecipes from "../components/ListRecipes";
import { fetchCategoryWiseRecipes } from "../store/slices/recipe";

export default function Category({ navigation }) {
  const [page, setPage] = useState(1);
  const route = useRoute();

  const { category } = route.params;
  const { recipes, loading } = useSelector((state) => state.recipes);
  const dispatch = useDispatch();

  useEffect(() => {
    if (category) {
      dispatch(fetchCategoryWiseRecipes({ category, page: 1 }));
    }
  }, [category, dispatch]);

  const fetchMoreRecipes = () => {
    setPage((prevPage) => prevPage + 1);
    dispatch(fetchCategoryWiseRecipes({ category, page: page + 1 }));
  };

  return (
    <View style={styles.container}>
      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="teal" style={styles.loader} />
      ) : recipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../../assets/images/noData.png")} 
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>No {category} Recipes Found</Text>
        </View>
      ) : (
        <ListRecipes recipes={recipes} fetchMore={fetchMoreRecipes} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  loader: {
    // marginTop: 50,
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  emptyContainer: {
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
    resizeMode: "contain",
  },
  emptyText: {
    fontSize: 22,
    color: "black",
    fontFamily:"Primary-Bold"

  },
});
