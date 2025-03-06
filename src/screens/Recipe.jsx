import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Recipe() {
    return (
        <View style={styles.container}>
            {/* Image Section */}
            <View style={styles.imgContainer}>
                <Image source={require('../../assets/images/pizza.jpg')} style={styles.recipeImg} />
            </View>

            {/* Scrollable Content Section */}
            <ScrollView style={styles.scrollContent}>
                <View style={styles.recipeDataDiv}>
                    {/* Recipe Title and Rating */}
                    <View style={styles.ownerNameDiv}>
                        <Text style={styles.recipeTitle}>Oreo Shake</Text>
                        <View style={styles.rating}>
                            <Ionicons name="star" size={20} color="orange" />
                            <Text style={styles.ratingText}>4.5</Text>
                        </View>
                    </View>

                    {/* Recipe Icons Section */}
                    <View style={styles.recipeIcons}>
                        <View style={styles.iconItem}>
                            <Ionicons name='time' size={20} color='gray' />
                            <Text style={styles.iconText}>10 mins</Text>
                        </View>
                        <View style={styles.iconItem}>
                            <Ionicons name='podium-outline' size={20} color='gray' />
                            <Text style={styles.iconText}>2 servings</Text>
                        </View>
                        <View style={styles.iconItem}>
                            <Ionicons name='flame' size={20} color='gray' />
                            <Text style={styles.iconText}>Medium Heat</Text>
                        </View>
                    </View>
                </View>

                {/* Description Section */}
                <View style={styles.descriptionDiv}>
                    <Text style={styles.descriptionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>
                        Chocolate is the best kind of dessert. These choco macarons are simply heavenly delicate little cookies filled with chocolate ganache.
                    </Text>
                </View>

                {/* Ingredients section */}
                <View style={styles.ingredientsDiv}>
                    <Text style={styles.descriptionTitle}>Ingredients</Text>
                    <View style={styles.ingredientsContainer}>
                        <View style={styles.ingredientItem}>
                            <View style={styles.ingredientContent}>
                                <Image source={require('../../assets/images/breakFast.png')} style={styles.ingredientImage} />
                                <Text style={styles.ingredientName}>Granulated Sugar</Text>
                            </View>
                            <View style={styles.ingredientAmountContainer}>
                                <Text style={styles.ingredientAmount}>160g</Text>
                            </View>
                        </View>
                        <View style={styles.ingredientItem}>
                            <View style={styles.ingredientContent}>
                                <Image source={require('../../assets/images/lunch.png')} style={styles.ingredientImage} />
                                <Text style={styles.ingredientName}>Granulated Sugar</Text>
                            </View>
                            <View style={styles.ingredientAmountContainer}>
                                <Text style={styles.ingredientAmount}>140g</Text>
                            </View>
                        </View>
                        {/* <View style={styles.ingredientItem}>
                            <View style={styles.ingredientContent}>
                                <Image source={require('../../assets/images/dinner.png')} style={styles.ingredientImage} />
                                <Text style={styles.ingredientName}>Granulated Sugar</Text>
                            </View>
                            <View style={styles.ingredientAmountContainer}>
                                <Text style={styles.ingredientAmount}>140g</Text>
                            </View>
                        </View> */}
                    </View>
                </View>
                <TouchableOpacity style={styles.button}>
                    <Ionicons name="play-circle-outline" size={30} color="white" style={styles.playIcon}/>
                    <Text style={styles.buttonText}>Watch Videos</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '',
    },
    imgContainer: {
        height: 300,
        width: '100%',
    },
    recipeImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 15,
    },
    scrollContent: {
        padding: 15,
    },
    recipeDataDiv: {
        backgroundColor: '',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginBottom: 20,
    },
    ownerNameDiv: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    recipeTitle: {
        fontFamily: 'Primary-Bold',
        fontSize: 28,
        color: 'black',
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontFamily: 'Primary-Regular',
        fontSize: 20,
        marginLeft: 8,
    },
    recipeIcons: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    iconItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 1,
    },
    iconText: {
        marginLeft: 5,
        fontFamily: 'Primary-Regular',
        fontSize: 16,
        color: '',
    },
    descriptionDiv: {
        marginTop: 0,
    },
    descriptionTitle: {
        fontFamily: 'Primary-Bold',
        fontSize: 26,
        marginBottom: 4,
    },
    descriptionText: {
        fontFamily: 'Primary-Regular',
        fontSize: 16,
        color: 'black',
        lineHeight: 24,
    },
    ingredientsDiv: {
        marginTop: 10,
    },
    descriptionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    ingredientItem: {
        backgroundColor: '#ebf0ec',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
        padding: 10,
        borderRadius: 15,
    },
    ingredientContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ingredientImage: {
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 5,
        objectFit: 'cover',
    },
    ingredientName: {
        fontSize: 18,
        color: 'black',
        fontFamily: 'Primary-Bold'
    },
    ingredientAmountContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    ingredientAmount: {
        fontSize: 18,
        color: 'black',
        fontFamily: 'Primary-Bold'
    },
    button:{
        width:'50%',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        padding:10,
        backgroundColor:'teal',
        borderRadius:15,
        marginTop:10,
        margin:'auto'
    },
    buttonText:{
        fontFamily:'Primary-Bold',
        fontSize:20,
        color:'white',
        marginLeft:5
    }
});
