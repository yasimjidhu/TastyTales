import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import SearchBar from '../components/SearchBar';
import Ionicons from "react-native-vector-icons/Ionicons";
import Constants from 'expo-constants';
import { useSelector } from 'react-redux';
import { getUserProfile } from '../store/slices/user';

export const Home = ({ navigation }) => {
    const [recipes, setRecipes] = useState([]);
    const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL

    const { user, loading, error } = useSelector((state) => state.user)

    const handleCategoryPress = (category) => {
        navigation.navigate('Category',{category})
    }

    const handleDishClick = (recipeId) => {
        navigation.navigate('Recipe', { recipeId });
    }

    const fetchRecipes = async () => {
        try {
            const response = await fetch(`${API_URL}/api/recipes`);
            const data = await response.json();
            setRecipes(data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    }
    useEffect(() => {
        fetchRecipes();
        getUserProfile()
    }, []);

    const handleProfileClick = ()=>{
        navigation.navigate('Account');
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}

        >
            <View style={styles.flexRow}>
                <View style={styles.welcomeDiv}>
                    <Text style={{ fontFamily: 'Primary-Regular', fontSize: 24 }}>Hello <Text style={styles.userName}>{user?.name?.toUpperCase()}</Text></Text>
                    <Text style={{ fontFamily: 'Primary-ExtraBold', fontSize: 24 }}>
                        What would you like
                    </Text>
                    <Text style={{ fontFamily: 'Primary-ExtraBold', fontSize: 24 }}>to cook today?</Text>
                </View>
                <TouchableOpacity onPress={handleProfileClick}>
                <View style={styles.profileDiv}>
                    {
                        user?.image ? (
                            <Image source={{ uri: user.image }} style={{ width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: 'teal' }} />
                        ) : (
                            <Ionicons name="person-circle-outline" size={70} color="white" />
                        )
                    }
                </View>
                </TouchableOpacity>
            </View>

            {/* Search Bar Section */}
            <SearchBar />

            {/* Categories Section with Horizontal Scrolling */}
            <View style={styles.categoriesContainer}>
                <View style={styles.flexRow}>
                    <Text style={styles.categoryHeading}>Categories</Text>
                    <Text style={styles.seeAll}>See all</Text>
                </View>

                {/* Horizontal ScrollView for Category Boxes */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryBoxContainer}
                >
                    <TouchableOpacity style={styles.categoryBox} onPress={()=>handleCategoryPress('breakfast')}>
                        <Image source={require('../../assets/images/breakFast.png')} style={styles.categoryImage} />
                        <Text style={styles.categoryText}>BreakFast</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.categoryBox} onPress={()=>handleCategoryPress('lunch')}>
                        <Image source={require('../../assets/images/lunch.png')} style={styles.categoryImage} />
                        <Text style={styles.categoryText}>Lunch</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.categoryBox} onPress={()=>handleCategoryPress('dinner')}>
                        <Image source={require('../../assets/images/dinner.png')} style={styles.categoryImage} />
                        <Text style={styles.categoryText}>Dinner</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.categoryBox} onPress={()=>handleCategoryPress('dessert')}>
                        <Image source={require('../../assets/images/dessert.png')} style={styles.categoryImage} />
                        <Text style={styles.categoryText}>Dessert</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Recommendation Section */}
            <View style={styles.recommendationContainer}>
                <View style={styles.flexRow}>
                    <Text style={styles.categoryHeading}>Recommendations</Text>
                    <Text style={styles.seeAll}>See all</Text>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.recBoxContainer}
                >
                    {recipes?.map((recipe, index) => (
                        <TouchableOpacity key={recipe._id || index} onPress={() => handleDishClick(recipe._id)}>
                            <View style={styles.recImgContainer}>
                                <Image
                                    source={
                                        recipe?.image
                                            ? { uri: recipe.image }
                                            : require('../../assets/images/pasta.jpg') // fallback image
                                    }
                                    style={styles.RecImg}
                                />
                            </View>
                            <View style={styles.recTextContainer}>
                                <Text style={styles.recipeText}>{recipe?.title || 'Untitled'}</Text>
                                <Text style={styles.ownerText}>{recipe?.author || 'By Unknown'}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Recipes of the week section */}
            <View style={styles.recipeWeekContainer}>
                <View style={styles.flexRow}>
                    <Text style={styles.categoryHeading}>Recipes Of The Week</Text>
                    <Text style={styles.seeAll}>See all</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryBoxContainer}>
                    <View style={styles.recipeWeekImgContainer}>
                        <Image source={require('../../assets/images/pasta.jpg')} style={styles.recipeWeekImg} />
                        <View style={styles.textOverlay}>
                            <Text style={styles.weekRecipeText}>Creamy Pasta</Text>
                            <Text style={styles.ownerText}>By Charles peter</Text>
                        </View>
                    </View>
                    <View style={styles.recipeWeekImgContainer}>
                        <Image source={require('../../assets/images/juice.jpg')} style={styles.recipeWeekImg} />
                        <View style={styles.textOverlay}>
                            <Text style={styles.weekRecipeText}>Creamy Pasta</Text>
                            <Text style={styles.ownerText}>By Charles peter</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileDiv: {
        backgroundColor: 'gray',
        height: 70,
        width: 70,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userName: {
        fontFamily: 'Primary-Bold',
        fontSize: 24,
        color: 'teal',
    },
    categoriesContainer: {
        marginTop: 25,
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
    categoryBoxContainer: {
        marginTop: 20,
        flexDirection: 'row',
    },
    categoryBox: {
        height: 80,
        width: 90,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F8FF',
        borderRadius: 15,
        marginRight: 15,
    },
    categoryImage: {
        width: '70%',
        height: '70%',
        borderRadius: 15,
    },
    categoryText: {
        textAlign: 'center',
        color: 'black',
        fontFamily: 'Primary-Bold',
    },
    recommendationContainer: {
        marginTop: 30,
    },
    recBoxContainer: {
        marginTop: 10,
        flexDirection: 'row',
    },
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
    recipeWeekContainer: {
        marginTop: 1,
        backgroundColor: ''
    },
    recipeWeekImgContainer: {
        height: 150,
        width: 300,
        backgroundColor: 'teal',
        borderRadius: 15,
        marginRight: 15,
        position: 'relative'
    },
    recipeWeekImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 15
    },
    textOverlay: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 10,
    },
    weekRecipeText: {
        color: 'white',
        textAlign: 'left',
        fontFamily: 'Primary-ExtraBold',
        fontSize: 12,
    },
    ownerText: {
        color: 'white',
        textAlign: 'right',
        fontFamily: 'Primary-Regular',
        fontSize: 10,
    },

});
