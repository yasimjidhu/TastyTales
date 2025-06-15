export const renderStars = (rating, onPress = null, size = 20) => {
    return (
        <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                    key={star}
                    onPress={() => onPress && onPress(star)}
                    disabled={!onPress}
                >
                    <Ionicons
                        name={star <= rating ? "star" : "star-outline"}
                        size={size}
                        color="#FFD700"
                        style={{ marginRight: 2 }}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};