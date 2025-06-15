import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';
import { getUserProfile, updateUserProfile, updateUserProfileImage } from '../store/slices/user';
import { TextInput } from 'react-native-gesture-handler';

export default function Account() {
    const [profileImg, setProfileImg] = useState(user?.image || '')
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const { user, loading, error } = useSelector((state) => state.user)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserProfile())
    }, [dispatch, user]);

    useEffect(() => {
        if (user) {
            setProfileImg(user.image || '');
            setName(user.name || '');
            setPhone(user.phone || '');
        }
    }, [user]);

    const selectImage = async () => {

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission required", "Permission to access camera roll is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            setProfileImg(result.assets[0].uri);
            await uploadToCloudinary(result.assets[0].uri)
                .then((url) => {
                    dispatch(updateUserProfileImage({ userId: user?.id, imageUri: url }))
                    Alert.alert("Upload successful", "Your profile image has been updated successfully.");
                })
                .catch((error) => {
                    console.error('Error uploading image:', error);
                    Alert.alert("Upload failed", "There was an error uploading your image. Please try again.");
                });
        }
    };

    const handleSave = () => {
        if (!name.trim() && !phone.trim()) {
            Alert.alert('Validation Error', 'Please provide a name or phone number to update.');
            return;
        }

        if(phone && !/^\+?[1-9]\d{1,14}$/.test(phone.trim())) {
            Alert.alert('Validation Error', 'Please enter a valid phone number.');
            return;
        }
        const updateData = {};
        if (name.trim() && name !== user?.name) updateData.name = name.trim();
        if (phone.trim() && phone !== user?.phone) updateData.phone = phone.trim();

        if (Object.keys(updateData).length === 0) {
            Alert.alert('Nothing to Update', 'No changes detected.');
            return;
        }

        dispatch(updateUserProfile({ userId: user?.id, ...updateData }))
            .then(() => {
                Alert.alert('Success', 'Profile updated successfully');
                setEditMode(false);
            })
            .catch(() => {
                setEditMode(false);
                Alert.alert('Error', 'Failed to update profile');
            });
    };


    return (
        <View style={styles.container}>
            <View style={styles.profileWrapper}>
                <View style={styles.profileDiv}>
                    {
                        profileImg ? (
                            <Image source={{ uri: profileImg }} style={styles.img} />
                        ) : (

                            <Ionicons name="person-circle-outline" size={100} color="white" />
                        )
                    }
                </View>
                <TouchableOpacity style={styles.editIcon} onPress={selectImage}>
                    <Ionicons name="camera" size={20} color="white" />
                </TouchableOpacity>
            </View>
            {/* Name */}
            <Text style={styles.name}>{user?.name}</Text>

            {/* Section Title */}
            <View style={styles.infoTextContainer}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                {editMode ? (
                    <TouchableOpacity onPress={handleSave}>
                        <Text style={styles.editText}>Save</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => setEditMode(true)}>
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Info Section */}
            <View style={styles.infoContainer}>
                <View style={styles.row}>
                    <View style={styles.left}>
                        <Icon name='envelope' size={18} color='white' />
                        <Text style={styles.label}>Email</Text>
                    </View>
                    <Text style={styles.right}>{user?.email}</Text>
                </View>

                <View style={styles.row}>
                    <View style={styles.left}>
                        <Icon name='phone' size={18} color='white' />
                        <Text style={styles.label}>Phone</Text>
                    </View>
                    {editMode ? (
                        <TextInput
                            style={styles.right}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter your phone number"
                        />
                    ) :
                        <Text style={styles.right}>{user?.phone || '+1 234 567 890'}</Text>
                    }
                </View>

                <View style={styles.row}>
                    <View style={styles.left}>
                        <Icon name='user' size={18} color='white' />
                        <Text style={styles.label}>Username</Text>
                    </View>
                    {editMode ? (
                        <TextInput
                            style={styles.right}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your username"
                        />
                    ) :
                        <Text style={styles.right}>{user?.name || 'User123'}</Text>
                    }
                </View>
            </View>
            <Text style={styles.sectionTitle}>Your Actions</Text>
            {/* Info Section */}
            <View style={styles.infoContainer}>
                <View style={styles.row}>
                    <View style={styles.left}>
                        <Icon name='bookmark' size={18} color='white' />
                        <Text style={styles.label}>Saved Recipes</Text>
                    </View>
                    <Text style={styles.right}>{user?.savedRecipes?.length} Recipes</Text>
                </View>

                <View style={styles.row}>
                    <View style={styles.left}>
                        <Icon name='heart' size={18} color='white' />
                        <Text style={styles.label}>Liked Recipes</Text>
                    </View>
                    <Text style={styles.right}>{user?.likedRecipes?.length} Recipes</Text>
                </View>

                <View style={styles.row}>
                    <View style={styles.left}>
                        <Icon name='cutlery' size={18} color='white' />
                        <Text style={styles.label}>Created Recipes</Text>
                    </View>
                    <Text style={styles.right}>5 Recipes</Text>
                </View>

                <View style={styles.row}>
                    <View style={styles.left}>
                        <Icon name='history' size={18} color='white' />
                        <Text style={styles.label}>Recently Viewed</Text>
                    </View>
                    <Text style={styles.right}>8 Recipes</Text>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        marginTop: 10,
    },
    profileWrapper: {
        position: 'relative',
        marginBottom: 10,
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'teal',
        borderRadius: 15,
        padding: 5,
        elevation: 3,
    },
    profileDiv: {
        backgroundColor: 'gray',
        height: 100,
        width: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 50,
    },
    name: {
        fontSize: 22,
        fontFamily: 'Primary-Bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'Primary-Regular',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        width: '60%',
        paddingVertical: 2,
    },
    input: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'Primary-Regular',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        width: '60%',
        paddingVertical: 2,
    },
    infoTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Primary-Bold',
        alignSelf: 'flex-start',
    },
    editText: {
        fontSize: 18,
        fontFamily: 'Primary-Bold',
        color: 'white',
        backgroundColor: 'black',
        padding: 5,
        borderRadius: 5,
        textAlign: 'center',
        width: 60,
    },
    infoContainer: {
        width: '100%',
        padding: 15,
        backgroundColor: 'teal',
        borderRadius: 10,
        elevation: 2,
        marginBottom: 12
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 12,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 8,
        borderRadius: 5,
        width: '40%',
    },
    label: {
        color: 'white',
        fontSize: 14,
    },
    right: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'Primary-Regular'
    },
});
