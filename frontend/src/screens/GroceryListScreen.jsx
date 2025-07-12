import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import { deleteGroceryItem } from "../store/slices/grocery";
import CustomAlert from "../components/Alert";

// Components
const GroceryItem = ({ item, onDelete }) => (
  <View style={styles.itemCard}>
    <View style={styles.itemInfo}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemQty}>{item.quantity || "1 qty"}</Text>
    </View>
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => onDelete(item)}
    >
      <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
    </TouchableOpacity>
  </View>
);

const RecipeHeader = ({ title, image }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.headerImageContainer}>
      {image ? (
        <Image source={{ uri: image }} style={styles.recipeImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons name="basket-outline" size={20} color="#6C7B7F" />
        </View>
      )}
    </View>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const GrocerySection = ({ recipeId, items, recipes, onDeleteItem }) => {
  const getRecipeDetails = (recipeId) => {
    if (!recipeId) return { title: "My Items", image: null };
    const recipe = recipes.find((r) => r._id === recipeId);
    return {
      title: recipe?.title || "Recipe",
      image: recipe?.image || null,
    };
  };

  const { title, image } = getRecipeDetails(recipeId);

  return (
    <View style={styles.section}>
      <RecipeHeader title={title} image={image} />
      <View style={styles.itemsContainer}>
        {items.map((item, idx) => (
          <GroceryItem
            key={`${item._id}-${idx}`}
            item={item}
            onDelete={onDeleteItem}
          />
        ))}
      </View>
    </View>
  );
};

const EmptyState = () => (
  <View style={styles.emptyState}>
    <Ionicons name="basket-outline" size={64} color="#BDC3C7" />
    <Text style={styles.emptyTitle}>Your grocery list is empty</Text>
    <Text style={styles.emptySubtitle}>
      Add items from your recipes or create custom items
    </Text>
  </View>
);

const GroceryScreen = () => {
  const dispatch = useDispatch();
  const groceryList = useSelector((state) => state.grocery.list);
  const recipes = useSelector((state) => state.recipes.recipes);

  const [alertVisible, setAlertVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Group items by recipeId
  const groupedItems = groceryList?.reduce((acc, item) => {
    const key = item.recipeId || "general";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const confirmDeleteItem = (item) => {
    setItemToDelete(item);
    setAlertVisible(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      dispatch(deleteGroceryItem(itemToDelete._id));
      setItemToDelete(null);
    }
    setAlertVisible(false);
  };

  if (!groceryList || groceryList.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.entries(groupedItems)}
        keyExtractor={([recipeId]) => recipeId}
        renderItem={({ item }) => {
          const [recipeId, items] = item;
          return (
            <GrocerySection
              recipeId={recipeId}
              items={items}
              recipes={recipes}
              onDeleteItem={confirmDeleteItem}
            />
          );
        }}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      <CustomAlert
        visible={alertVisible}
        title="Remove Item"
        message={`Remove "${itemToDelete?.name}" from your list?`}
        onCancel={() => setAlertVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFB",
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerImageContainer: {
    marginRight: 12,
  },
  recipeImage: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E8F4F8",
  },
  placeholderImage: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E8F4F8",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
    flex: 1,
  },
  itemsContainer: {
    gap: 8,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 2,
  },
  itemQty: {
    fontSize: 14,
    color: "#6C7B7F",
    fontWeight: "500",
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#FFF5F5",
    marginLeft: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C3E50",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6C7B7F",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default GroceryScreen;
