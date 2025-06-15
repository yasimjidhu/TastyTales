import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import TimerComponent from '../components/Timer';
import QuickActionsComponent from '../components/QuickActions';

const CookingStepsScreen = ({ route, navigation }) => {
    const { recipe } = route.params;
    const steps = recipe.instructions.split(/\d+\.\s+/).filter(Boolean);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [stepNotes, setStepNotes] = useState({});
    const [completedSteps, setCompletedSteps] = useState({});

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };

    // Callback handlers for Quick Actions
    const handleNoteAdded = (stepIndex, note) => {
        setStepNotes(prev => ({
            ...prev,
            [stepIndex]: [...(prev[stepIndex] || []), note]
        }));
    };

    const handlePhotoTaken = (stepIndex, source) => {
        console.log(`Photo taken for step ${stepIndex} from ${source}`);
        // Handle photo logic here
    };

    const handleStepCompleted = (stepIndex, isCompleted) => {
        setCompletedSteps(prev => ({
            ...prev,
            [stepIndex]: isCompleted
        }));
        console.log(`Step ${stepIndex} completion status: ${isCompleted}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.recipeTitle}>{recipe.title}</Text>
                    <ProgressBar
                        progress={(currentStepIndex + 1) / steps.length}
                        color="#4ECDC4"
                        style={styles.progressBar}
                    />
                    <Text style={styles.progressText}>
                        Step {currentStepIndex + 1} of {steps.length}
                    </Text>
                </View>

                {/* Recipe Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: recipe?.image || 'https://via.placeholder.com/400x300' }}
                        style={styles.recipeImg}
                        resizeMode="cover"
                    />
                    <View style={styles.imageOverlay}>
                        <Text style={styles.overlayText}>Step {currentStepIndex + 1}</Text>
                    </View>
                </View>

                {/* Timer Section */}
                <TimerComponent stepIndex={currentStepIndex}/>

                {/* Step Content */}
                <View style={styles.stepContainer}>
                    <Text style={styles.stepLabel}>Current Step</Text>
                    <Text style={styles.stepText}>{steps[currentStepIndex]}</Text>
                </View>

                {/* Quick Actions */}
                <QuickActionsComponent 
                    stepIndex={currentStepIndex}
                    onNoteAdded={handleNoteAdded}
                    onPhotoTaken={handlePhotoTaken}
                    onStepCompleted={handleStepCompleted}
                    initialCompleted={completedSteps[currentStepIndex] || false}
                />

                {/* Ingredients Reminder */}
                {recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
                    <View style={styles.ingredientsContainer}>
                        <Text style={styles.sectionTitle}>🥄 Ingredients for this step</Text>
                        <View style={styles.ingredientsList}>
                            {recipe.ingredients.slice(0, 3).map((ingredient, index) => {
                                // Handle both string and object ingredients
                                const ingredientText = typeof ingredient === 'string' 
                                    ? ingredient 
                                    : ingredient?.name || ingredient?.ingredient || String(ingredient);
                                
                                return (
                                    <View key={index} style={styles.ingredientItem}>
                                        <Text style={styles.bulletPoint}>•</Text>
                                        <Text style={styles.ingredientText}>{ingredientText}</Text>
                                    </View>
                                );
                            })}
                            {recipe.ingredients.length > 3 && (
                                <TouchableOpacity style={styles.showMoreButton}>
                                    <Text style={styles.showMoreText}>
                                        +{recipe.ingredients.length - 3} more ingredients
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}

                {/* Tips Section */}
                <View style={styles.tipsContainer}>
                    <Text style={styles.sectionTitle}>💡 Cooking Tips</Text>
                    <View style={styles.tipCard}>
                        <Text style={styles.tipText}>
                            {currentStepIndex === 0 && "Start by reading through all steps before beginning."}
                            {currentStepIndex === 1 && "Keep your ingredients organized and within reach."}
                            {currentStepIndex === 2 && "Taste as you go to adjust seasoning."}
                            {currentStepIndex >= 3 && "Don't rush - good cooking takes time!"}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Navigation Buttons - Fixed at bottom */}
            <View style={styles.navButtons}>
                <TouchableOpacity
                    style={[styles.navButton, styles.prevButton, currentStepIndex === 0 && styles.disabledButton]}
                    onPress={handlePrevious}
                    disabled={currentStepIndex === 0}
                >
                    <Text style={[styles.buttonText, currentStepIndex === 0 && styles.disabledText]}>
                        ← Previous
                    </Text>
                </TouchableOpacity>

                {currentStepIndex === steps.length - 1 ? (
                    <TouchableOpacity
                        style={[styles.navButton, styles.finishButton]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.buttonText}>✓ Finish</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.navButton, styles.nextButton]}
                        onPress={handleNext}
                    >
                        <Text style={styles.buttonText}>Next →</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

export default CookingStepsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingBottom: 100, // Space for fixed navigation buttons
    },
    header: {
        padding: 20,
        paddingBottom: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    recipeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 16,
        textAlign: 'center',
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        marginBottom: 8,
        backgroundColor: '#E2E8F0',
    },
    progressText: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        fontWeight: '500',
    },
    imageContainer: {
        position: 'relative',
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    recipeImg: {
        width: '100%',
        height: 200,
        backgroundColor: '#F1F5F9',
    },
    imageOverlay: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    overlayText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    stepContainer: {
        margin: 20,
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    stepLabel: {
        fontSize: 14,
        color: '#4ECDC4',
        fontWeight: '600',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    stepText: {
        fontSize: 18,
        color: '#2D3748',
        lineHeight: 28,
        fontWeight: '400',
    },
    navButtons: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    navButton: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 6,
    },
    prevButton: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    nextButton: {
        backgroundColor: '#4ECDC4',
    },
    finishButton: {
        backgroundColor: '#48BB78',
    },
    disabledButton: {
        backgroundColor: '#F7FAFC',
        borderColor: '#E2E8F0',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'black',
    },
    disabledText: {
        color: '#A0AEC0',
    },
    // New styles for additional components
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: 12,
    },
    timerContainer: {
        margin: 20,
        marginTop: 10,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    timerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timerButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 8,
        backgroundColor: '#F7FAFC',
        borderRadius: 8,
        marginHorizontal: 4,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    timerButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A5568',
    },
    quickActionsContainer: {
        margin: 20,
        marginTop: 10,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionButton: {
        width: '48%',
        paddingVertical: 12,
        paddingHorizontal: 8,
        backgroundColor: '#F8FAFC',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    actionIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#4A5568',
    },
    ingredientsContainer: {
        margin: 20,
        marginTop: 10,
        padding: 16,
        backgroundColor: '#FFF8E1',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#FFA726',
    },
    ingredientsList: {
        marginTop: 4,
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    bulletPoint: {
        color: '#FFA726',
        fontSize: 16,
        marginRight: 8,
        fontWeight: 'bold',
    },
    ingredientText: {
        fontSize: 14,
        color: '#5D4037',
        flex: 1,
    },
    showMoreButton: {
        marginTop: 8,
        alignItems: 'center',
    },
    showMoreText: {
        fontSize: 12,
        color: '#FFA726',
        fontWeight: '600',
    },
    tipsContainer: {
        margin: 20,
        marginTop: 10,
        padding: 16,
        backgroundColor: '#E8F5E8',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    tipCard: {
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    tipText: {
        fontSize: 14,
        color: '#2E7D32',
        fontStyle: 'italic',
        lineHeight: 20,
    },
});