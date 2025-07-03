import { useCallback, useState } from "react";
import {
  clearSuggestions,
  fetchSuggestedRecipes,
} from "../store/slices/recipe";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import ListRecipes from "../components/ListRecipes";
import { useFocusEffect } from "@react-navigation/native";
import LoadingSpinner from "../components/LoadingSpinner";

export default function RecipeSuggester() {
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");

  const dispatch = useDispatch();

  const { suggestions, loading } = useSelector((state) => state.recipes);

  const handleAdd = () => {
    if (input && !ingredients.includes(input.toLowerCase())) {
      setIngredients([...ingredients, input.toLowerCase()]);
      setInput("");
    }
  };

  const fetchSuggestions = () => {
    dispatch(fetchSuggestedRecipes(ingredients));
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        setIngredients([]);
        setInput("");
        dispatch(clearSuggestions());
      };
    }, [dispatch])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>What Ingredients Do You Have?</Text>

      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={(text) => setInput(text)}
          placeholder="Enter ingredient"
          style={styles.input}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ingredientList}>
        {ingredients.map((ing, idx) => (
          <Text key={idx} style={styles.ingredient}>
            {ing}
          </Text>
        ))}
      </View>

      <TouchableOpacity style={styles.suggestButton} onPress={fetchSuggestions}>
        <Text style={styles.suggestButtonText}>Suggest Recipes</Text>
      </TouchableOpacity>

      {loading ? (
         <LoadingSpinner message="Fetching Recipes..." />
      ) : (
        <ListRecipes recipes={suggestions} fetchMore={() => {}}/>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "black",
    paddingHorizontal: 12,
    justifyContent: "center",
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  ingredientList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  ingredient: {
    backgroundColor: "#eee",
    padding: 6,
    margin: 4,
    borderRadius: 6,
  },
  suggestButton: {
    backgroundColor: "#4ECDC4",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  suggestButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  recipeCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    marginTop: 12,
    textAlign: "center",
  },
});
