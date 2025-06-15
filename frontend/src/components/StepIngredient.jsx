// Enhanced Ingredients Component (replace your current ingredients section)
const StepIngredientsSection = ({ currentStepIndex, currentStep, allIngredients }) => {
    const stepIngredients = getStepIngredients(currentStepIndex, currentStep, allIngredients);
    const [showAll, setShowAll] = useState(false);

    if (!stepIngredients || stepIngredients.length === 0) {
        return null;
    }

    const extractIngredientsFromStep = (stepText, allIngredients) => {
        const stepIngredients = [];
        const stepLower = stepText.toLowerCase();

        allIngredients.forEach(ingredient => {
            const ingredientName = typeof ingredient === 'string'
                ? ingredient
                : ingredient?.name || ingredient?.ingredient || String(ingredient);

            // Extract main ingredient name (remove quantities and descriptions)
            const mainName = ingredientName.toLowerCase()
                .replace(/^\d+[\s\/]*\w*\s+/, '') // Remove quantities like "2 cups", "1/2 tsp"
                .replace(/\(.*?\)/g, '') // Remove parentheses content
                .split(',')[0] // Take first part before comma
                .trim();

            // Check if this ingredient is mentioned in the current step
            if (stepLower.includes(mainName) ||
                mainName.split(' ').some(word => word.length > 3 && stepLower.includes(word))) {
                stepIngredients.push(ingredient);
            }
        });

        return stepIngredients;
    };


    const displayIngredients = showAll ? stepIngredients : stepIngredients.slice(0, 3);

    return (
        <View style={styles.ingredientsContainer}>
            <View style={styles.ingredientsHeader}>
                <Text style={styles.sectionTitle}>🥄 Ingredients for this step</Text>
                {stepIngredients.length > 0 && (
                    <View style={styles.ingredientCount}>
                        <Text style={styles.countText}>{stepIngredients.length} items</Text>
                    </View>
                )}
            </View>

            <View style={styles.ingredientsList}>
                {displayIngredients.map((ingredient, index) => {
                    const ingredientText = typeof ingredient === 'string'
                        ? ingredient
                        : ingredient?.name || ingredient?.ingredient || String(ingredient);

                    return (
                        <View key={index} style={styles.ingredientItem}>
                            <View style={styles.ingredientBullet}>
                                <Text style={styles.bulletPoint}>•</Text>
                            </View>
                            <View style={styles.ingredientContent}>
                                <Text style={styles.ingredientText}>{ingredientText}</Text>
                            </View>
                            <TouchableOpacity style={styles.checkButton}>
                                <Text style={styles.checkIcon}>✓</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}

                {stepIngredients.length > 3 && (
                    <TouchableOpacity
                        style={styles.showMoreButton}
                        onPress={() => setShowAll(!showAll)}
                    >
                        <Text style={styles.showMoreText}>
                            {showAll
                                ? 'Show less'
                                : `+${stepIngredients.length - 3} more ingredients`
                            }
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Quick ingredient prep tips */}
            <View style={styles.prepTips}>
                <Text style={styles.prepTipText}>
                    💡 Prep tip: {getStepPrepTip(currentStep)}
                </Text>
            </View>
        </View>
    );
};

// Helper function for prep tips
const getStepPrepTip = (stepText) => {
    const stepLower = stepText.toLowerCase();

    if (stepLower.includes('chop') || stepLower.includes('dice')) {
        return "Have your knife and cutting board ready";
    }
    if (stepLower.includes('heat') || stepLower.includes('cook')) {
        return "Preheat your pan before adding ingredients";
    }
    if (stepLower.includes('mix') || stepLower.includes('stir')) {
        return "Use a mixing bowl large enough for easy stirring";
    }
    if (stepLower.includes('season')) {
        return "Taste as you season - you can always add more";
    }
    return "Read the full step before starting";
};

// Additional styles to add to your StyleSheet
const additionalStyles = {
    ingredientsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    ingredientCount: {
        backgroundColor: '#FFA726',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    countText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingVertical: 4,
    },
    ingredientBullet: {
        width: 20,
        alignItems: 'center',
    },
    ingredientContent: {
        flex: 1,
        marginLeft: 4,
    },
    checkButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E8F5E8',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    checkIcon: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    prepTips: {
        marginTop: 12,
        padding: 8,
        backgroundColor: 'rgba(255, 167, 38, 0.1)',
        borderRadius: 8,
    },
    prepTipText: {
        fontSize: 12,
        color: '#E65100',
        fontStyle: 'italic',
    },
};

// Usage in your main component:
// Replace your current ingredients section with:
{
    recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
        <StepIngredientsSection
            currentStepIndex={currentStepIndex}
            currentStep={steps[currentStepIndex]}
            allIngredients={recipe.ingredients}
        />
    )
}