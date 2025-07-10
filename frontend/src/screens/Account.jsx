import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
  FlatList,
  Dimensions,
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
import {
  fetchLikedRecipes,
  fetchMadeItRecipes,
  fetchSavedRecipes,
} from "../store/slices/recipe";

const { width } = Dimensions.get("window");
const GRID_SIZE = (width - 48) / 3;

export default function Account({ navigation }) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [activeTab, setActiveTab] = useState("posts"); // 'posts', 'saved', 'liked'

  const { user, imageUploading } = useSelector((state) => state.user);
  const { likedRecipes, savedRecipes, madeIt } = useSelector(
    (state) => state.recipes
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserProfile(user?._id));
    dispatch(fetchLikedRecipes());
    dispatch(fetchSavedRecipes());
    dispatch(fetchMadeItRecipes());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const selectImage = async () => {
    if (!user) return;

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access camera roll is required!"
      );
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
        dispatch(
          updateUserProfileImage({ userId: user._id, imageUri: cloudUrl })
        );
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

  const handleDishClick = (recipeId) => {
    navigation.navigate("Recipe", { recipeId: recipeId });
  };

  const getActiveData = () => {
    console.log("active user");
    switch (activeTab) {
      case "posts":
        return madeIt || [];
      case "saved":
        return savedRecipes || [];
      case "liked":
        return likedRecipes || [];
      default:
        return [];
    }
  };

  const renderRecipeItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.gridItem}
        onPress={() => handleDishClick(item._id)}
      >
        <Image
          source={{
            uri:
              item.image || item.imageUrl || "https://via.placeholder.com/150",
          }}
          style={styles.gridImage}
        />
        <View style={styles.gridOverlay}>
          <Text style={styles.gridTitle} numberOfLines={2}>
            {item.name || item.title || "Recipe"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name={
          activeTab === "posts"
            ? "camera-outline"
            : activeTab === "saved"
            ? "bookmark-outline"
            : "heart-outline"
        }
        size={50}
        color="#ccc"
      />
      <Text style={styles.emptyText}>
        {activeTab === "posts"
          ? "No posts yet"
          : activeTab === "saved"
          ? "No saved recipes"
          : "No liked recipes"}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileRing}>
            {imageUploading ? (
              <ActivityIndicator size="small" color="white" />
            ) : user?.image ? (
              <Image source={{ uri: user.image }} style={styles.profileImage} />
            ) : (
              <Ionicons name="person-circle-outline" size={80} color="gray" />
            )}
            <TouchableOpacity
              style={styles.editIcon}
              onPress={selectImage}
              disabled={imageUploading}
            >
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {user?.madeItRecipes?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {user?.followers?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {user?.following?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      {/* Username and Edit Button */}
      <View style={styles.userInfo}>
        <Text style={styles.username}>{user?.name}</Text>
        <TouchableOpacity
          onPress={editMode ? handleSave : () => setEditMode(true)}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>
            {editMode ? "Save" : "Edit Profile"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Personal Information (only visible in edit mode) */}
      {editMode && (
        <View style={styles.editSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoContainer}>
            {/* Email */}
            <View style={styles.row}>
              <View style={styles.left}>
                <Icon name="envelope" size={16} color="gray" />
                <Text style={styles.label}>Email</Text>
              </View>
              <Text style={styles.right}>{user?.email}</Text>
            </View>

            {/* Phone */}
            <View style={styles.row}>
              <View style={styles.left}>
                <Icon name="phone" size={16} color="gray" />
                <Text style={styles.label}>Phone</Text>
              </View>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>

            {/* Username */}
            <View style={styles.row}>
              <View style={styles.left}>
                <Icon name="user" size={16} color="gray" />
                <Text style={styles.label}>Username</Text>
              </View>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </View>
      )}

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "posts" && styles.activeTab]}
          onPress={() => setActiveTab("posts")}
        >
          <Ionicons
            name="grid-outline"
            size={24}
            color={activeTab === "posts" ? "#000" : "#999"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "saved" && styles.activeTab]}
          onPress={() => setActiveTab("saved")}
        >
          <Ionicons
            name="bookmark-outline"
            size={24}
            color={activeTab === "saved" ? "#000" : "#999"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "liked" && styles.activeTab]}
          onPress={() => setActiveTab("liked")}
        >
          <Ionicons
            name="heart-outline"
            size={24}
            color={activeTab === "liked" ? "#000" : "#999"}
          />
        </TouchableOpacity>
      </View>

      {/* Grid Content */}
      <View style={styles.gridContainer}>
        {getActiveData().length > 0 ? (
          <FlatList
            data={getActiveData()}
            renderItem={renderRecipeItem}
            numColumns={3}
            keyExtractor={(item, index) => `${activeTab}-${item._id || index}`}
            contentContainerStyle={styles.gridContent}
            scrollEnabled={false}
            columnWrapperStyle={styles.gridRow}
          />
        ) : (
          renderEmptyState()
        )}
      </View>

      {/* Quick Stats (non-editable) */}
      {!editMode && (
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatNumber}>
              {user?.recentlyViewed?.length || 0}
            </Text>
            <Text style={styles.quickStatLabel}>Recently Viewed</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  profileImageContainer: {
    marginRight: 20,
  },
  profileRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#c13584",
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  editIcon: {
    position: "absolute",
    bottom:1,
    right: 8,
    backgroundColor: "#1DA1F2",
    padding: 4,
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000",
  },
  statLabel: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
  userInfo: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  editButtonText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
  },
  editSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  infoContainer: {
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginLeft: 6,
  },
  right: {
    fontSize: 14,
    color: "#000",
    maxWidth: "60%",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 4,
    fontSize: 14,
    color: "#000",
    width: "60%",
    textAlign: "right",
  },
  tabContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  gridContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  gridContent: {
    paddingTop: 16,
  },
  gridRow: {
    justifyContent: "space-between",
  },
  gridItem: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    marginBottom: 2,
    position: "relative",
  },
  gridImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gridOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  gridTitle: {
    color: "white",
    fontSize: 12,
    // fontWeight: "500",
    fontFamily: "Primary-Bold",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
    marginTop: 12,
  },
  quickStats: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  quickStatItem: {
    alignItems: "center",
  },
  quickStatNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  quickStatLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
});
