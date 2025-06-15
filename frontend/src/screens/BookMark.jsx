import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import React from 'react';
import SearchBar from '../components/SearchBar';

export default function BookMark() {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>BookMark</Text>
            <SearchBar />
            <View style={styles.recentContainer}>
                <View style={styles.recentTextDiv}>
                    <Text style={styles.miniHeading}>Recently Viewed</Text>
                    <Text style={styles.seeall}>See all</Text>
                </View>
                <View style={styles.recentItemsContainer}>
                    <View style={styles.recentImgContainer}>
                        <Image source={require('../../assets/images/pasta.jpg')} style={styles.recentImg} />
                    </View>
                    <View style={styles.recentMiniImgContainer}>
                        <View style={styles.recentMiniItem}>
                            <Image source={require('../../assets/images/chicken.jpg')} style={styles.recentMiniImg1} />
                        </View>
                        <View style={styles.recentMiniItem}>
                            <Image source={require('../../assets/images/pizza.jpg')} style={styles.recentMiniImg1} />
                            <View style={styles.overlay}>
                                <Text style={styles.overlayText}>32 + Recipes</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.madeItContainer}>
                <View style={styles.recentTextDiv}>
                    <Text style={styles.miniHeading}>Made It</Text>
                    <Text style={styles.seeall}>See all</Text>
                </View>
                <View style={styles.recentItemsContainer}>
                    <View style={styles.recentImgContainer}>
                        <Image source={require('../../assets/images/juice.jpg')} style={styles.recentImg} />
                    </View>
                    <View style={styles.recentMiniImgContainer}>
                        <View style={styles.recentMiniItem}>
                            <Image source={require('../../assets/images/chicken.jpg')} style={styles.recentMiniImg1} />
                        </View>
                        <View style={styles.recentMiniItem}>
                            <Image source={require('../../assets/images/pizza.jpg')} style={styles.recentMiniImg1} />
                            <View style={styles.overlay}>
                                <Text style={styles.overlayText}>32 + Recipes</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.madeItContainer}>
                <View style={styles.recentTextDiv}>
                    <Text style={styles.miniHeading}>BreakFast</Text>
                    <Text style={styles.seeall}>See all</Text>
                </View>
                <View style={styles.recentItemsContainer}>
                    <View style={styles.recentImgContainer}>
                        <Image source={require('../../assets/images/pasta.jpg')} style={styles.recentImg} />
                    </View>
                    <View style={styles.recentMiniImgContainer}>
                        <View style={styles.recentMiniItem}>
                            <Image source={require('../../assets/images/chicken.jpg')} style={styles.recentMiniImg1} />
                        </View>
                        <View style={styles.recentMiniItem}>
                            <Image source={require('../../assets/images/pizza.jpg')} style={styles.recentMiniImg1} />
                            <View style={styles.overlay}>
                                <Text style={styles.overlayText}>32 + Recipes</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    heading: {
        fontFamily: 'Primary-Bold',
        fontSize: 28,
        marginLeft: 15,
        marginTop: 20,
    },
    recentContainer: {
        marginTop: 25,
    },
    miniHeading: {
        fontFamily: 'Primary-Bold',
        fontSize: 20,
    },
    seeall: {
        fontFamily: 'Primary-Bold',
        fontSize: 16,
        color: 'teal',
    },
    recentTextDiv: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15,
    },
    recentItemsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        marginHorizontal: 15,
    },
    recentImgContainer: {
        width: '60%',
        height: 150,
        marginTop: 10,
        borderRadius: 15,
        overflow: 'hidden', 
        backgroundColor:'teal'
    },
    recentImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    recentMiniImgContainer: {
        marginTop:15,
        width: '35%',
        height: 150,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    recentMiniItem: {
        flex: 1,
        backgroundColor: 'lightcoral', 
        borderRadius: 15,
        marginBottom: 8,
        overflow: 'hidden',
    },
    recentMiniImg1: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    overlay:{
        backgroundColor:'rgba(0,0,0,0.8)',
        width:'100% '
    },
    overlay:{
        position:'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
        backgroundColor:'rgba(0,0,0,0.4)',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:15
    },
    overlayText:{
        color:'white',
        fontFamily:'Primary-ExtraBold',
        fontSize:15
    },
    madeItContainer:{
        marginTop:10
    }
});
