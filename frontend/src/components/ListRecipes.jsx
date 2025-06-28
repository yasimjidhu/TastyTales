import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function ListRecipes({recipes}) {
    const navigation = useNavigation();
    const handleDishClick = (id) => {
        if (id) {
            navigation.navigate('Recipe', { recipeId: id });
        } else {
            console.warn("Recipe ID is not available");
        }
    }
  return (
    <View style={styles.recommendationContainer}>
      <View style={styles.flexRow}>
        <Text style={styles.categoryHeading}>Recommendations</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.recBoxContainer}
      >
        {recipes?.map((recipe, index) => (
          <TouchableOpacity
            key={recipe._id || index}
            onPress={() => handleDishClick(recipe._id)}
          >
            <View style={styles.recImgContainer}>
              <Image
                source={
                  recipe?.image
                    ? { uri: recipe.image }
                    : require("../../assets/images/pasta.jpg") // fallback image
                }
                style={styles.RecImg}
              />
            </View>
            <View style={styles.recTextContainer}>
              <Text style={styles.recipeText}>
                {recipe?.title || "Untitled"}
              </Text>
              <Text style={styles.ownerText}>
                {recipe?.author || "By Unknown"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    recImgContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 140,
        width: 140,
        backgroundColor: '#F8F8FF',
        borderRadius: 15,
        marginRight: 10,
        overflow: 'hidden',
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryHeading: {
        fontFamily: 'Primary-Bold',
        fontSize: 20,
    },
    seeAll: {
        fontFamily: 'Primary-Bold',
        fontSize: 16,
        color: 'teal',
    },
    recBoxContainer: {
        marginTop: 10,
        flexDirection: 'row',
    },
    RecImg: {
        width: '100%',
        height: '100%',
    },
    recipeText: {
        fontFamily: 'Primary-Bold',
        fontSize: 16
    },
    recTextContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 5
    },
    ownerText: {
        fontFamily: 'Primary-Regular',
        color: 'black',
        fontSize: 12
    },
})