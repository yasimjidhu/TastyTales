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
import CustomAlert from "../components/Alert";

const { width } = Dimensions.get("window");
const GRID_SIZE = (width - 56) / 3;

export default function Account({ navigation }) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [activeTab, setActiveTab] = useState("posts"); // 'posts', 'saved', 'liked'
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    type: "",
    message: "",
    onConfirm: null,
  });

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
      setAlertConfig({
        visible: true,
        title: "Permission required",
        type: "error",
        message: "Permission to access camera roll is required!",
        onConfirm: () =>
          setAlertConfig((prev) => ({ ...prev, visible: false })),
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;

      // Set loading to true before starting upload
      setIsUploadingImage(true);
      try {
        const cloudUrl = await uploadToCloudinary(imageUri);
        dispatch(
          updateUserProfileImage({ userId: user._id, imageUri: cloudUrl })
        );

        setAlertConfig({
          visible: true,
          title: "Success",
          type: "success",
          message: "Profile image updated",
          onConfirm: () =>
            setAlertConfig((prev) => ({ ...prev, visible: false })),
        });
      } catch (error) {
        console.error(error);
        setAlertConfig({
          visible: true,
          title: "Error",
          type: "error",
          message: "Failed to upload image",
          onConfirm: () =>
            setAlertConfig((prev) => ({ ...prev, visible: false })),
        });
      } finally {
        // Always set loading to false when done
        setIsUploadingImage(false);
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
      setAlertConfig({
        visible: true,
        title: "Error",
        type: "error",
        message: "no changes detected",
        onConfirm: () =>
          setAlertConfig((prev) => ({ ...prev, visible: false })),
      });
      return;
    }

    dispatch(updateUserProfile({ userId: user._id, ...updateData }))
      .unwrap()
      .then(() => {
        setAlertConfig({
          visible: true,
          title: "Success",
          type: "success",
          message: "Profile Details updated",
          onConfirm: () =>
            setAlertConfig((prev) => ({ ...prev, visible: false })),
        });
        setEditMode(false);
      })
      .catch(() => {
        setAlertConfig({
          visible: true,
          title: "Error",
          type: "error",
          message: "Failed to update profile details",
          onConfirm: () =>
            setAlertConfig((prev) => ({ ...prev, visible: false })),
        });
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
        activeOpacity={0.8}
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
      <View style={styles.emptyIconContainer}>
        <Ionicons
          name={
            activeTab === "posts"
              ? "camera-outline"
              : activeTab === "saved"
              ? "bookmark-outline"
              : "heart-outline"
          }
          size={48}
          color="#E5E7EB"
        />
      </View>
      <Text style={styles.emptyText}>
        {activeTab === "posts"
          ? "No posts yet"
          : activeTab === "saved"
          ? "No saved recipes"
          : "No liked recipes"}
      </Text>
      <Text style={styles.emptySubtext}>
        {activeTab === "posts"
          ? "Share your first recipe creation"
          : activeTab === "saved"
          ? "Save recipes to find them here"
          : "Like recipes to see them here"}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileRing}>
            {isUploadingImage ? (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingSpinner}>
                  <ActivityIndicator size="large" color="#14B8A6" />
                </View>
                <View style={styles.loadingOverlay}>
                  <Text style={styles.loadingText}>Uploading...</Text>
                  <View style={styles.loadingDots}>
                    <View style={[styles.dot, styles.dot1]} />
                    <View style={[styles.dot, styles.dot2]} />
                    <View style={[styles.dot, styles.dot3]} />
                  </View>
                </View>
              </View>
            ) : user?.image ? (
              <Image source={{ uri: user.image }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="person-outline" size={40} color="#9CA3AF" />
              </View>
            )}
            <TouchableOpacity
              style={[
                styles.editIcon,
                isUploadingImage && styles.editIconDisabled,
              ]}
              onPress={selectImage}
              disabled={isUploadingImage}
              activeOpacity={imageUploading ? 1 : 0.8}
            >
              {isUploadingImage ? (
                <Ionicons name="hourglass-outline" size={14} color="white" />
              ) : (
                <Ionicons name="camera" size={14} color="white" />
              )}
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
        <Text style={styles.username}>{user?.name || "User"}</Text>
        <TouchableOpacity
          onPress={editMode ? handleSave : () => setEditMode(true)}
          style={[
            styles.editButton,
            editMode ? styles.saveButton : styles.normalButton,
          ]}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.editButtonText,
              editMode ? styles.saveButtonText : styles.normalButtonText,
            ]}
          >
            {editMode ? "Save Changes" : "Edit Profile"}
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
                <View style={styles.iconContainer}>
                  <Icon name="envelope" size={14} color="#6B7280" />
                </View>
                <Text style={styles.label}>Email</Text>
              </View>
              <Text style={styles.right}>{user?.email}</Text>
            </View>

            {/* Phone */}
            <View style={styles.row}>
              <View style={styles.left}>
                <View style={styles.iconContainer}>
                  <Icon name="phone" size={14} color="#6B7280" />
                </View>
                <Text style={styles.label}>Phone</Text>
              </View>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>

            {/* Username */}
            <View style={[styles.row, { borderBottomWidth: 0 }]}>
              <View style={styles.left}>
                <View style={styles.iconContainer}>
                  <Icon name="user" size={14} color="#6B7280" />
                </View>
                <Text style={styles.label}>Username</Text>
              </View>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
                placeholderTextColor="#9CA3AF"
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
          activeOpacity={0.8}
        >
          <Ionicons
            name={activeTab === "posts" ? "grid" : "grid-outline"}
            size={22}
            color={activeTab === "posts" ? "#14B8A6" : "#9CA3AF"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "saved" && styles.activeTab]}
          onPress={() => setActiveTab("saved")}
          activeOpacity={0.8}
        >
          <Ionicons
            name={activeTab === "saved" ? "bookmark" : "bookmark-outline"}
            size={22}
            color={activeTab === "saved" ? "#14B8A6" : "#9CA3AF"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "liked" && styles.activeTab]}
          onPress={() => setActiveTab("liked")}
          activeOpacity={0.8}
        >
          <Ionicons
            name={activeTab === "liked" ? "heart" : "heart-outline"}
            size={22}
            color={activeTab === "liked" ? "#14B8A6" : "#9CA3AF"}
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

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        type={alertConfig.type}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm}
        onCancel={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: "white",
  },
  profileImageContainer: {
    marginRight: 24,
  },
  profileRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: "#14B8A6",
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    shadowColor: "#14B8A6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  loadingContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0FDFA",
    position: "relative",
  },
  loadingSpinner: {
    position: "absolute",
    zIndex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    bottom: 8,
    alignItems: "center",
    zIndex: 2,
  },
  loadingText: {
    fontSize: 11,
    color: "#14B8A6",
    fontWeight: "600",
    marginBottom: 4,
  },
  loadingDots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#14B8A6",
    marginHorizontal: 1,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  editIconDisabled: {
    backgroundColor: "#9CA3AF",
    opacity: 0.6,
  },
  editIcon: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#14B8A6",
    padding: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
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
    fontWeight: "700",
    fontSize: 20,
    color: "#111827",
    letterSpacing: -0.5,
  },
  statLabel: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 4,
    fontWeight: "500",
  },
  userInfo: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "white",
  },
  username: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  normalButton: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  saveButton: {
    backgroundColor: "#14B8A6",
    borderWidth: 0,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  normalButtonText: {
    color: "#374151",
  },
  saveButtonText: {
    color: "white",
  },
  editSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  infoContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomColor: "#F3F4F6",
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  label: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "500",
  },
  right: {
    fontSize: 15,
    color: "#111827",
    maxWidth: "55%",
    fontWeight: "500",
  },
  input: {
    borderBottomWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingVertical: 8,
    fontSize: 15,
    color: "#111827",
    width: "55%",
    textAlign: "right",
    fontWeight: "500",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#14B8A6",
  },
  gridContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  gridContent: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  gridRow: {
    justifyContent: "space-between",
  },
  gridItem: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    marginBottom: 4,
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  gridTitle: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Primary-Bold",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyText: {
    color: "#374151",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  emptySubtext: {
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
  },
  quickStats: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "white",
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  quickStatItem: {
    alignItems: "center",
  },
  quickStatNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.5,
  },
  quickStatLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
    fontWeight: "500",
  },
});
