import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import {
  getUserProfile,
  updateUserProfile,
  updateUserProfileImage,
} from "../store/slices/user";

export default function Account() {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const { user, imageUploading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) dispatch(getUserProfile(user._id));
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const selectImage = async () => {
    if (!user) return;

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      try {
        const cloudUrl = await uploadToCloudinary(imageUri);
        dispatch(updateUserProfileImage({ userId: user._id, imageUri: cloudUrl }));
        Alert.alert("Success", "Profile image updated");
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to upload image");
      }
    }
  };

  const handleSave = () => {
    if (!name.trim() && !phone.trim()) {
      Alert.alert("Validation Error", "Please provide a name or phone number");
      return;
    }
    if (phone && !/^\+?[1-9]\d{1,14}$/.test(phone.trim())) {
      Alert.alert("Validation Error", "Please enter a valid phone number.");
      return;
    }

    const updateData = {};
    if (name.trim() && name !== user?.name) updateData.name = name.trim();
    if (phone.trim() && phone !== user?.phone) updateData.phone = phone.trim();

    if (Object.keys(updateData).length === 0) {
      Alert.alert("Nothing to Update", "No changes detected.");
      return;
    }

    dispatch(updateUserProfile({ userId: user._id, ...updateData }))
      .unwrap()
      .then(() => {
        Alert.alert("Success", "Profile updated");
        setEditMode(false);
      })
      .catch(() => {
        Alert.alert("Error", "Failed to update profile");
      });
  };

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <View style={styles.profileWrapper}>
        <View style={styles.profileDiv}>
          {imageUploading ? (
            <ActivityIndicator size="small" color="white" />
          ) : user?.image ? (
            <Image source={{ uri: user.image }} style={styles.img} />
          ) : (
            <Ionicons name="person-circle-outline" size={100} color="white" />
          )}
        </View>

        <TouchableOpacity
          style={styles.editIcon}
          onPress={selectImage}
          disabled={imageUploading}
        >
          <Ionicons name="camera" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{user?.name}</Text>

      {/* Personal Info */}
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

      <View style={styles.infoContainer}>
        {/* Email */}
        <View style={styles.row}>
          <View style={styles.left}>
            <Icon name="envelope" size={18} color="white" />
            <Text style={styles.label}>Email</Text>
          </View>
          <Text style={styles.right}>{user?.email}</Text>
        </View>

        {/* Phone */}
        <View style={styles.row}>
          <View style={styles.left}>
            <Icon name="phone" size={18} color="white" />
            <Text style={styles.label}>Phone</Text>
          </View>
          {editMode ? (
            <TextInput
              style={styles.right}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone"
              placeholderTextColor="#ccc"
            />
          ) : (
            <Text style={styles.right}>{user?.phone || "+1 234 567 890"}</Text>
          )}
        </View>

        {/* Username */}
        <View style={styles.row}>
          <View style={styles.left}>
            <Icon name="user" size={18} color="white" />
            <Text style={styles.label}>Username</Text>
          </View>
          {editMode ? (
            <TextInput
              style={styles.right}
              value={name}
              onChangeText={setName}
              placeholder="Enter your username"
              placeholderTextColor="#ccc"
            />
          ) : (
            <Text style={styles.right}>{user?.name || "User123"}</Text>
          )}
        </View>
      </View>

      {/* Actions Section */}
      <Text style={styles.sectionTitle}>Your Actions</Text>
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <View style={styles.left}>
            <Icon name="bookmark" size={18} color="white" />
            <Text style={styles.label}>Saved Recipes</Text>
          </View>
          <Text style={styles.right}>
            {user?.savedRecipes?.length || 0} Recipes
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.left}>
            <Icon name="heart" size={18} color="white" />
            <Text style={styles.label}>Liked Recipes</Text>
          </View>
          <Text style={styles.right}>
            {user?.likedRecipes?.length || 0} Recipes
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.left}>
            <Icon name="cutlery" size={18} color="white" />
            <Text style={styles.label}>Created Recipes</Text>
          </View>
          <Text style={styles.right}>
            {user?.madeItRecipes?.length || 0} Recipes
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.left}>
            <Icon name="history" size={18} color="white" />
            <Text style={styles.label}>Recently Viewed</Text>
          </View>
          <Text style={styles.right}>
            {user?.recentlyViewed?.length || 0} Recipes
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    marginTop: 10,
  },
  profileWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  profileDiv: {
    backgroundColor: "gray",
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "teal",
    borderRadius: 15,
    padding: 5,
    elevation: 3,
  },
  img: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    resizeMode: "cover",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "black",
  },
  infoTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: "black",
  },
  editText: {
    fontSize: 16,
    color: "white",
    backgroundColor: "black",
    padding: 5,
    borderRadius: 5,
    textAlign: "center",
    width: 60,
  },
  infoContainer: {
    width: "100%",
    padding: 15,
    backgroundColor: "teal",
    borderRadius: 10,
    elevation: 2,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 8,
    borderRadius: 5,
    width: "40%",
  },
  label: {
    color: "white",
    fontSize: 14,
  },
  right: {
    fontSize: 18,
    color: "white",
    maxWidth: "60%",
  },
});
