import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Share,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  addReview,
  fetchPopularRecipes,
  fetchRecipe,
  saveOrUnsaveRecipe,
} from "../store/slices/recipe";
import { followOrUnfollow, likeOrUnlikeRecipe } from "../store/slices/user";
import { renderStars } from "../components/RenderStars";
import CustomAlert from "../components/Alert";

const { width, height } = Dimensions.get("window");

export default function Recipe({ navigation }) {
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviewsList, setShowReviewsList] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());

  const dispatch = useDispatch();
  const route = useRoute();

  const { recipeId } = route.params;
  const recipe = useSelector((state) =>
    state.recipes.recipes.find((r) => r._id == recipeId)
  );
  const { user, loading, error } = useSelector((state) => state.user);
  const { savedRecipes, popularRecipes } = useSelector(
    (state) => state.recipes
  );

  useEffect(() => {
    if (recipeId) {
      dispatch(fetchRecipe(recipeId));
      dispatch(fetchPopularRecipes());
    }
  }, [recipeId, dispatch]);

  const handleLikeOrUnlike = () => {
    dispatch(likeOrUnlikeRecipe(recipeId));
  };

  const handleSaveOrUnsave = async () => {
    dispatch(saveOrUnsaveRecipe(recipeId));
  };

  const handleIngredientCheck = (index) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  const handleAddReview = async () => {
    if (newReview.trim() === "" || newRating === 0) {
      setAlertTitle("Incomplete Review");
      setAlertMessage("Please provide both a rating and review text.");
      setAlertVisible(true);
      return;
    }

    try {
      await dispatch(
        addReview({
          recipeId,
          rating: newRating,
          comment: newReview.trim(),
          userName: user?.name || "Anonymous User",
          userImage: user?.image || "",
        })
      );

      setNewReview("");
      setNewRating(0);
      setShowReviewModal(false);
      setAlertTitle("Review Added");
      setAlertMessage("Your review has been added successfully!");
      setAlertVisible(true);
    } catch (error) {
      setAlertTitle("Error");
      setAlertMessage("Failed to add review. Please try again.");
      setAlertVisible(true);
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this recipe: ${recipe?.title}\n\n${
          recipe?.description || ""
        }\n\nView it in our app!`,
        url: recipe?.image,
        title: recipe?.title,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type: ", result.activityType);
        } else {
          console.log("Recipe shared");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.error("Error sharing recipe:", error.message);
    }
  };

  const averageRating =
    recipe?.reviews?.length > 0
      ? (
          recipe.reviews.reduce((sum, review) => sum + review.rating, 0) /
          recipe.reviews.length
        ).toFixed(1)
      : "4.8";

  const isLikedByUser = user?.likedRecipes?.includes(recipeId);
  const isSaved = savedRecipes?.some((r) => r._id === recipeId);
  const isPopular = popularRecipes?.some((r) => r._id === recipeId);
  const isFollowing = user?.following?.some((id)=> id === recipe?.user)   
  return (
    <View style={styles.container}>
      {/* Enhanced Image Section with Overlay */}
      <View style={styles.imgContainer}>
        <Image
          source={{
            uri: recipe?.image || "https://via.placeholder.com/400x300",
          }}
          style={styles.recipeImg}
        />

        {/* Gradient Overlay */}
        <View style={styles.gradientOverlay} />

        {/* Floating Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLikeOrUnlike}
          >
            <Ionicons
              name={isLikedByUser ? "heart" : "heart-outline"}
              size={24}
              color={isLikedByUser ? "red" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Recipe Badge */}
        {isPopular && (
          <View style={styles.recipeBadge}>
            <Ionicons name="restaurant-outline" size={16} color="#fff" />
            <Text style={styles.badgeText}>Popular Recipe</Text>
          </View>
        )}
      </View>
      {/* Enhanced Scrollable Content */}
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* Recipe Header */}
          <View style={styles.recipeHeader}>
            <View style={styles.titleSection}>
              <Text style={styles.recipeTitle}>
                {recipe?.title || "Delicious Recipe"}
              </Text>

              <View style={styles.authorContainer}>
                <View style={styles.authorInfo}>
                  {recipe?.authorImage ? (
                    <Image
                      source={{ uri: recipe.authorImage }}
                      style={styles.authorAvatar}
                    />
                  ) : (
                    <View style={styles.authorPlaceholder}>
                      <Text style={styles.authorInitial}>
                        {recipe?.authorName?.charAt(0)?.toUpperCase() || "U"}
                      </Text>
                    </View>
                  )}

                  <View>
                    <Text style={styles.authorLabel}>Recipe by</Text>
                    <Text style={styles.authorName}>
                      {recipe?.authorName || "Unknown Chef"}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity style={[styles.followEnhanced,isFollowing && {backgroundColor:'#BDC3C7'}]} onPress={()=>dispatch(followOrUnfollow(recipe?.user))}>
                  <Ionicons name={isFollowing ? "checkmark" : "person-add"} size={16} color="#fff" />
                  <Text style={styles.followTextEnhanced}>{isFollowing ? "Following" : "Follow"}</Text>
                </TouchableOpacity> 
              </View>
            </View>
            <View style={styles.ratingContainer}>
              <View style={styles.rating}>
                <Ionicons name="star" size={18} color="#FFD700" />
                <Text style={styles.ratingText}>{averageRating}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowReviewsList(true)}>
                <Text style={styles.reviewCount}>
                  ({recipe?.reviews?.length || 324} reviews)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Enhanced Recipe Stats */}
          <View style={styles.recipeStats}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="time-outline" size={22} color="#4ECDC4" />
              </View>
              <Text style={styles.statValue}>{recipe?.cookTime || "25"}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="people-outline" size={22} color="#4ECDC4" />
              </View>
              <Text style={styles.statValue}>{recipe?.servings || "2"}</Text>
              <Text style={styles.statLabel}>Servings</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="flame-outline" size={22} color="#4ECDC4" />
              </View>
              <Text style={styles.statValue}>{recipe?.calories}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="ribbon-outline" size={22} color="#4ECDC4" />
              </View>
              <Text style={styles.statValue}>{recipe?.level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
          </View>

          {/* Enhanced Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Recipe</Text>
            <Text style={styles.descriptionText}>
              {recipe?.description ||
                "A delicious and easy-to-make recipe that brings together the perfect blend of flavors and textures. This dish is perfect for any occasion and will surely impress your family and friends."}
            </Text>
          </View>

          {/* Enhanced Ingredients Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <TouchableOpacity style={styles.servingAdjuster}>
                <Ionicons
                  name="remove-circle-outline"
                  size={20}
                  color="#4ECDC4"
                />
                <Text style={styles.servingText}>4 servings</Text>
                <Ionicons name="add-circle-outline" size={20} color="#4ECDC4" />
              </TouchableOpacity>
            </View>

            {(
              recipe?.ingredients || [
                { name: "Fresh Tomatoes", amount: "4 large" },
                { name: "Olive Oil", amount: "2 tbsp" },
                { name: "Garlic Cloves", amount: "3 pieces" },
                { name: "Fresh Basil", amount: "1 cup" },
              ]
            ).map((ingredient, index) => (
              <View key={index} style={styles.ingredientCard}>
                <View style={styles.ingredientImageContainer}>
                  <Ionicons
                    name="nutrition-outline"
                    size={24}
                    color="#4ECDC4"
                  />
                </View>
                <View style={styles.ingredientInfo}>
                  <Text
                    style={[
                      styles.ingredientName,
                      checkedIngredients.has(index) && styles.checkedText,
                    ]}
                  >
                    {ingredient.name}
                  </Text>
                  <Text
                    style={[
                      styles.ingredientAmount,
                      checkedIngredients.has(index) && styles.checkedText,
                    ]}
                  >
                    {ingredient.quantity || ingredient.amount}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.checkButton}
                  onPress={() => handleIngredientCheck(index)}
                >
                  <Ionicons
                    name={
                      checkedIngredients.has(index)
                        ? "checkmark-circle"
                        : "checkmark-circle-outline"
                    }
                    size={24}
                    color={
                      checkedIngredients.has(index) ? "#4ECDC4" : "#7F8C8D"
                    }
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Enhanced Action Buttons */}
          <View style={styles.actionSection}>
            {/* Start Cooking Button */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate("CookingSteps", { recipe })}
            >
              <Ionicons name="play-circle" size={24} color="white" />
              <Text style={styles.primaryButtonText}>Start Cooking</Text>
            </TouchableOpacity>

            {/* Secondary Buttons: Save & Review */}
            <View style={styles.secondaryButtons}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleSaveOrUnsave}
              >
                <Ionicons
                  name={isSaved ? "bookmark" : "bookmark-outline"}
                  size={20}
                  color={isSaved ? "#4ECDC4" : "black"}
                />
                <Text
                  style={[
                    styles.secondaryButtonText,
                    { color: isSaved ? "#4ECDC4" : "black" },
                  ]}
                >
                  {isSaved ? "Saved" : "Save"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setShowReviewModal(true)}
              >
                <Ionicons name="chatbubble-outline" size={20} color="#4ECDC4" />
                <Text style={styles.secondaryButtonText}>Add Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add Review Modal */}
      <Modal
        visible={showReviewModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Review</Text>
              <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                <Ionicons name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>Rating</Text>
              {renderStars(newRating, setNewRating, 30)}
            </View>

            <View style={styles.reviewInputSection}>
              <Text style={styles.reviewInputLabel}>Your Review</Text>
              <TextInput
                style={styles.reviewInput}
                multiline
                numberOfLines={4}
                placeholder="Share your thoughts about this recipe..."
                value={newReview}
                onChangeText={setNewReview}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!newReview.trim() || newRating === 0) && styles.disabledButton,
              ]}
              onPress={handleAddReview}
              disabled={!newReview.trim() || newRating === 0}
            >
              <Text style={styles.submitButtonText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Reviews List Modal */}
      <Modal
        visible={showReviewsList}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReviewsList(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Reviews ({recipe?.reviews?.length || 0})
              </Text>
              <TouchableOpacity onPress={() => setShowReviewsList(false)}>
                <Ionicons name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.reviewsList}
              showsVerticalScrollIndicator={false}
            >
              {recipe?.reviews?.map((review, index) => (
                <View key={index} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerInfo}>
                      <View style={styles.reviewerAvatar}>
                        {review.userImage ? (
                          <Image
                            source={{ uri: review.userImage }}
                            style={styles.avatarImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <Text style={styles.avatarText}>
                            {review.userName?.charAt(0).toUpperCase() || "U"}
                          </Text>
                        )}
                      </View>

                      <View>
                        <Text style={styles.reviewerName}>
                          {review.userName || "Anonymous"}
                        </Text>
                        <Text style={styles.reviewDate}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    {renderStars(review.rating, null, 16)}
                  </View>
                  <Text style={styles.reviewText}>{review.comment}</Text>
                </View>
              )) || (
                <View style={styles.noReviews}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={48}
                    color="#BDC3C7"
                  />
                  <Text style={styles.noReviewsText}>No reviews yet</Text>
                  <Text style={styles.noReviewsSubtext}>
                    Be the first to review this recipe!
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        title={alertTitle}
        onCancel={() => setAlertVisible(false)}
        onConfirm={() => setAlertVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  imgContainer: {
    height: height * 0.4,
    width: "100%",
    position: "relative",
  },
  recipeImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  actionButtons: {
    position: "absolute",
    top: 50,
    right: 20,
    flexDirection: "column",
    gap: 10,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  recipeBadge: {
    position: "absolute",
    top: 50,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(78, 205, 196, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  scrollContent: {
    flex: 1,
    marginTop: -20,
  },
  contentContainer: {
    backgroundColor: "#FAFAFA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    minHeight: height * 0.6,
  },
  recipeHeader: {
    marginBottom: 24,
  },
  titleSection: {
    marginBottom: 8,
  },
  recipeTitle: {
    fontSize: 28,
    color: "#2C3E50",
    marginBottom: 4,
    fontFamily: "Primary-Bold",
  },
  recipeCategory: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 4,
    color: "#2C3E50",
  },
  reviewCount: {
    fontSize: 14,
    color: "#7F8C8D",
    textDecorationLine: "underline",
  },
  recipeStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  statCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0FDFC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  servingAdjuster: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  servingText: {
    fontSize: 14,
    color: "#2C3E50",
    marginHorizontal: 8,
    fontWeight: "500",
  },
  descriptionText: {
    fontSize: 18,
    color: "#5D6D7E",
    lineHeight: 24,
    textAlign: "justify",
    fontFamily: "Primary-ExtraBold",
    marginTop: 5,
  },
  ingredientCard: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  ingredientImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  ingredientInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 2,
  },
  ingredientAmount: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  checkedText: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  checkButton: {
    padding: 8,
    borderRadius: 12,
  },
  actionSection: {
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: "#4ECDC4",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 8,
  },
  secondaryButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8F4F8",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4ECDC4",
    marginLeft: 6,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8F4F8",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  ratingSection: {
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 12,
  },
  reviewInputSection: {
    marginBottom: 24,
  },
  reviewInputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 12,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: "#E8F4F8",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    backgroundColor: "#F8F9FA",
  },
  submitButton: {
    backgroundColor: "#4ECDC4",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#BDC3C7",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  reviewsList: {},
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewItem: {
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4ECDC4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
  },
  reviewDate: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  reviewText: {
    fontSize: 18,
    color: "#5D6D7E",
    lineHeight: 20,
    textAlign: "left",
    marginTop: 4,
    marginLeft: 52,
    marginRight: 8,
    fontFamily: "Primary-ExtraBold",
  },
  noReviews: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  noReviewsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7F8C8D",
    marginTop: 16,
  },
  noReviewsSubtext: {
    fontSize: 14,
    color: "#BDC3C7",
    marginTop: 4,
  },
  authorContainer: {
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 12,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
  marginTop: 12,
  marginBottom: 20,
},

authorInfo: {
  flexDirection: "row",
  alignItems: "center",
},

authorAvatar: {
  width: 48,
  height: 48,
  borderRadius: 24,
  marginRight: 12,
  borderWidth: 0,
  borderColor: "#4ECDC4",
},

authorPlaceholder: {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: "#4ECDC4",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 12,
},

authorInitial: {
  color: "white",
  fontSize: 18,
  fontWeight: "bold",
},

authorLabel: {
  fontSize: 12,
  color: "#7F8C8D",
},

authorName: {
  fontSize: 18,
  fontWeight: "600",
  color: "#2C3E50",
  fontFamily:"Primary-Bold"
},

followEnhanced: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#4ECDC4",
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 20,
  shadowColor: "#4ECDC4",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 4,
},

followTextEnhanced: {
  color: "#fff",
  fontWeight: "600",
  marginLeft: 6,
  fontSize: 14,
},
});
