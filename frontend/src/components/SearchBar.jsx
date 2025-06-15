import React, { useEffect } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function SearchBar({ text }) {
    const [searchText, setSearchText] = React.useState('');

    const handleSearchChange = (text) => {
        setSearchText(text);
    };

    useEffect(() => {

    }, [searchText])

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for recipes"
                    value={searchText}
                    onChangeText={handleSearchChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        // padding:20
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
        backgroundColor: '#e0dede',
        padding: 10,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#f2f2f2',
    },
    searchIcon: {
        padding: 5,
    },
    searchInput: {
        width: '90%',
        height: 40,
        marginLeft: 10,
    },
})