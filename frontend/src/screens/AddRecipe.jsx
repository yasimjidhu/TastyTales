import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';


const { width } = Dimensions.get('window');

export default function AddRecipeScreen({ navigation }) {
    const [recipe, setRecipe] = useState({
        title: '',
        description: '',
        ingredients: [{ name: '', quantity: '' }],
        instructions: '',
        image: null,
        level: 'easy',
        category: 'breakfast',
        calories: '',
        cookTime: '',
        servings: '',
        isVegetarian: false, // default vegetarian status
    });

    const [isLoading, setIsLoading] = useState(false);
    const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL


    const handleInputChange = (field, value) => {
        setRecipe(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...recipe.ingredients];
        newIngredients[index][field] = value;
        setRecipe(prev => ({
            ...prev,
            ingredients: newIngredients
        }));
    };

    const addIngredient = () => {
        setRecipe(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { name: '', quantity: '' }]
        }));
    };

    const removeIngredient = (index) => {
        if (recipe.ingredients.length > 1) {
            const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
            setRecipe(prev => ({
                ...prev,
                ingredients: newIngredients
            }));
        }
    };

    const selectImage = async () => {
        // Ask for permission
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
            setRecipe(prev => ({
                ...prev,
                image: result.assets[0].uri
            }));
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (!recipe.title.trim()) {
            Alert.alert('Error', 'Please enter a recipe title');
            return;
        }
        if (!recipe.description.trim()) {
            Alert.alert('Error', 'Please enter a recipe description');
            return;
        }
        const cleanedIngredients = recipe.ingredients.filter(
            ing => ing.name.trim() && ing.quantity.trim()
        );

        if (cleanedIngredients.length === 0) {
            Alert.alert('Error', 'Please add at least one ingredient with name and quantity');
            return;
        }

        if (!recipe.instructions.trim()) {
            Alert.alert('Error', 'Please enter cooking instructions');
            return;
        }

        setIsLoading(true);

        try {
            // Filter out empty ingredients
            const cleanedIngredients = recipe.ingredients.filter(ing => ing.trim());

            const recipeData = {
                ...recipe,
                ingredients: cleanedIngredients,
                calories: Number(recipe.calories) || 0,
                cookTime: Number(recipe.cookTime) || 0,
                servings: Number(recipe.servings) || 1,
            };

            const uploadedImage = recipe.image ? await uploadToCloudinary(recipe.image) : null;
            const response = await fetch(`${API_URL}/api/recipes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...recipeData,
                    image: uploadedImage,
                })
            });

            const data = await response.json();

            if (response.ok) {
                navigation.navigate("Home");
            } else {
                alert(data.error || "error occure while adding recipe. Try again.");
            }

            Alert.alert(
                'Success!',
                'Your recipe has been added successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Reset form
                            setRecipe({
                                title: '',
                                description: '',
                                ingredients: [''],
                                instructions: '',
                                image: null,
                            });
                            // Navigate back or to recipes list
                            navigation.goBack();
                        }
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to add recipe. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                {/* Image Upload */}
                <View style={styles.imageSection}>
                    <TouchableOpacity style={styles.imageUpload} onPress={selectImage}>
                        {recipe.image ? (
                            <Image source={{ uri: recipe.image }} style={styles.uploadedImage} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Ionicons name="camera" size={40} color="teal" />
                                <Text style={styles.imageText}>Add Photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Recipe Title */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Recipe Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter recipe name..."
                        value={recipe.title}
                        onChangeText={(value) => handleInputChange('title', value)}
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Description */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Brief description of your recipe..."
                        value={recipe.description}
                        onChangeText={(value) => handleInputChange('description', value)}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Ingredients */}
                <View style={styles.inputSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.label}>Ingredients</Text>
                        <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
                            <Ionicons name="add" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    {recipe.ingredients.map((ingredient, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <TextInput
                                style={[styles.input, { flex: 1, marginRight: 5 }]}
                                placeholder="Ingredient (e.g., Sugar)"
                                value={ingredient.name}
                                onChangeText={(text) => handleIngredientChange(index, 'name', text)}
                                placeholderTextColor="#999"
                            />
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="Quantity (e.g., 2 cups)"
                                value={ingredient.quantity}
                                onChangeText={(text) => handleIngredientChange(index, 'quantity', text)}
                                placeholderTextColor="#999"
                            />
                            {recipe.ingredients.length > 1 && (
                                <TouchableOpacity onPress={() => removeIngredient(index)} style={{ marginLeft: 5 }}>
                                    <Ionicons name="close" size={20} color="#ff4757" />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}

                </View>

                {/* Instructions */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Cooking Instructions</Text>
                    <TextInput
                        style={[styles.input, styles.instructionsArea]}
                        placeholder="Step by step cooking instructions..."
                        value={recipe.instructions}
                        onChangeText={(value) => handleInputChange('instructions', value)}
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                        placeholderTextColor="#999"
                    />
                </View>

                // Level picker (easy, medium, hard)
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Difficulty Level</Text>
                    <View style={styles.pickerRow}>
                        {['easy', 'medium', 'hard'].map(level => (
                            <TouchableOpacity
                                key={level}
                                style={[
                                    styles.levelButton,
                                    recipe.level === level && styles.levelButtonSelected,
                                ]}
                                onPress={() => handleInputChange('level', level)}
                            >
                                <Text style={[
                                    styles.levelButtonText,
                                    recipe.level === level && styles.levelButtonTextSelected,
                                ]}>{level.charAt(0).toUpperCase() + level.slice(1)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                // Category picker
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Category</Text>
                    <View style={styles.pickerRow}>
                        {['breakfast', 'lunch', 'dinner', 'snack', 'dessert'].map(cat => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.categoryButton,
                                    recipe.category === cat && styles.categoryButtonSelected,
                                ]}
                                onPress={() => handleInputChange('category', cat)}
                            >
                                <Text style={[
                                    styles.categoryButtonText,
                                    recipe.category === cat && styles.categoryButtonTextSelected,
                                ]}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                // Calories input
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Calories</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter calories"
                        keyboardType="numeric"
                        value={recipe.calories}
                        onChangeText={value => handleInputChange('calories', value)}
                        placeholderTextColor="#999"
                    />
                </View>

                // Cook time input
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Cook Time (minutes)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter cook time"
                        keyboardType="numeric"
                        value={recipe.cookTime}
                        onChangeText={value => handleInputChange('cookTime', value)}
                        placeholderTextColor="#999"
                    />
                </View>

                    // Servings input
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Servings</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter number of servings"
                        keyboardType="numeric"
                        value={recipe.servings}
                        onChangeText={value => handleInputChange('servings', value)}
                        placeholderTextColor="#999"
                    />
                </View>

                // Is Vegetarian toggle
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Vegetarian</Text>
                    <TouchableOpacity
                        style={styles.checkboxRow}
                        onPress={() => handleInputChange('isVegetarian', !recipe.isVegetarian)}
                    >
                        <Ionicons
                            name={recipe.isVegetarian ? "checkbox" : "square-outline"}
                            size={24}
                            color="teal"
                        />
                        <Text style={styles.checkboxText}>Is Vegetarian</Text>
                    </TouchableOpacity>
                </View>


                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Text style={styles.submitButtonText}>Adding Recipe...</Text>
                    ) : (
                        <>
                            <Ionicons name="add" size={20} color="white" />
                            <Text style={styles.submitButtonText}>Add Recipe</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e8ed',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    placeholder: {
        width: 40,
    },
    imageSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    imageUpload: {
        width: width * 0.8,
        height: 200,
        borderRadius: 15,
        overflow: 'hidden',
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        flex: 1,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'teal',
        borderStyle: 'dashed',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageText: {
        marginTop: 8,
        fontSize: 16,
        color: 'teal',
        fontWeight: '500',
    },
    inputSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e1e8ed',
        color: '#333',
    },
    textArea: {
        height: 80,
        paddingTop: 12,
    },
    instructionsArea: {
        height: 120,
        paddingTop: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    addButton: {
        backgroundColor: 'teal',
        borderRadius: 20,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ingredientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    ingredientInput: {
        flex: 1,
        marginRight: 10,
    },
    removeButton: {
        backgroundColor: '#ffe6e6',
        borderRadius: 20,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: 'teal',
        marginHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    submitButtonDisabled: {
        backgroundColor: '#95a5a6',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    levelButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'teal',
        marginRight: 10,
    },
    levelButtonSelected: {
        backgroundColor: 'teal',
    },
    levelButtonText: {
        color: 'teal',
        fontWeight: '600',
    },
    levelButtonTextSelected: {
        color: 'white',
    },

    categoryButton: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'teal',
        marginRight: 8,
    },
    categoryButtonSelected: {
        backgroundColor: 'teal',
    },
    categoryButtonText: {
        color: 'teal',
        fontWeight: '600',
    },
    categoryButtonTextSelected: {
        color: 'white',
    },

    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },

});