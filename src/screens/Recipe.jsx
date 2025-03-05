import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Recipe() {
    return (
        <View style={{ flex: 1 }}>
            {/* Image Section */}
            <View style={styles.container}>
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
                <View>
                    <Text style={styles.descriptionTitle}>Ingredients</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '',
        marginTop: 40,
        padding: 10,
    },
    recipeImg: {
        width: '100%',
        height: 300,
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
        marginBottom: 15,
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
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    iconItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
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
        marginBottom: 10,
    },
    descriptionText: {
        fontFamily: 'Primary-Regular',
        fontSize: 16,
        color: 'black',
        lineHeight: 24,
    },
});
