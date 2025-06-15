import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';

const QuickActionsComponent = ({ 
    stepIndex = 0, 
    onNoteAdded, 
    onPhotoTaken, 
    onStepCompleted, 
    initialCompleted = false 
}) => {
    const [stepCompleted, setStepCompleted] = useState(initialCompleted);
    const [notes, setNotes] = useState('');

    // Action handlers
    const handleAddNote = () => {
        Alert.prompt(
            "Add Cooking Note",
            `Add a note for step ${stepIndex + 1}:`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Save", 
                    onPress: (note) => {
                        if (note && note.trim()) {
                            const newNote = `Step ${stepIndex + 1}: ${note.trim()}`;
                            setNotes(prevNotes => prevNotes + (prevNotes ? '\n' : '') + newNote);
                            Alert.alert("Note Saved", "Your cooking note has been saved!");
                            
                            // Callback to parent component if provided
                            if (onNoteAdded) {
                                onNoteAdded(stepIndex, note.trim());
                            }
                        }
                    }
                }
            ],
            "plain-text",
            "",
            "default"
        );
    };

    const handleTakePhoto = () => {
        Alert.alert(
            "Take Photo",
            `Take a photo of step ${stepIndex + 1}:`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Camera", 
                    onPress: () => {
                        console.log(`Opening camera for step ${stepIndex + 1}`);
                        // Here you would integrate with react-native-image-picker
                        Alert.alert("Camera", "Camera functionality would open here");
                        
                        if (onPhotoTaken) {
                            onPhotoTaken(stepIndex, 'camera');
                        }
                    }
                },
                { 
                    text: "Gallery", 
                    onPress: () => {
                        console.log(`Opening gallery for step ${stepIndex + 1}`);
                        Alert.alert("Gallery", "Gallery functionality would open here");
                        
                        if (onPhotoTaken) {
                            onPhotoTaken(stepIndex, 'gallery');
                        }
                    }
                }
            ]
        );
    };

    const handleMarkDone = () => {
        const newCompletedState = !stepCompleted;
        setStepCompleted(newCompletedState);
        
        Alert.alert(
            newCompletedState ? "Step Completed! 🎉" : "Step Unmarked",
            newCompletedState 
                ? `Great job! Step ${stepIndex + 1} marked as complete.`
                : `Step ${stepIndex + 1} marked as incomplete.`
        );

        // Callback to parent component if provided
        if (onStepCompleted) {
            onStepCompleted(stepIndex, newCompletedState);
        }
    };

    const handleHelp = () => {
        const helpTips = [
            "🔪 Keep your knives sharp for safer cooking",
            "🧂 Taste and adjust seasoning as you go",
            "🕐 Use timers to avoid overcooking",
            "🧹 Clean as you cook to stay organized",
            "📖 Read through all steps before starting",
            "🌡️ Use a thermometer for meat doneness",
            "🥄 Measure ingredients accurately"
        ];

        const randomTips = helpTips.sort(() => 0.5 - Math.random()).slice(0, 4);
        
        Alert.alert(
            "🍳 Cooking Help & Tips",
            randomTips.join('\n\n'),
            [{ text: "Got it!", style: "default" }]
        );
    };

    return (
        <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>🔧 Quick Actions</Text>
            <View style={styles.actionGrid}>
                <TouchableOpacity style={styles.actionButton} onPress={handleAddNote}>
                    <Text style={styles.actionIcon}>📝</Text>
                    <Text style={styles.actionText}>Add Note</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton} onPress={handleTakePhoto}>
                    <Text style={styles.actionIcon}>📸</Text>
                    <Text style={styles.actionText}>Take Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[
                        styles.actionButton, 
                        stepCompleted && styles.completedAction
                    ]} 
                    onPress={handleMarkDone}
                >
                    <Text style={styles.actionIcon}>
                        {stepCompleted ? '✅' : '⭐'}
                    </Text>
                    <Text style={[
                        styles.actionText,
                        stepCompleted && styles.completedText
                    ]}>
                        {stepCompleted ? 'Completed' : 'Mark Done'}
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton} onPress={handleHelp}>
                    <Text style={styles.actionIcon}>❓</Text>
                    <Text style={styles.actionText}>Help</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: 12,
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
    completedAction: {
        backgroundColor: '#D1FAE5',
        borderColor: '#10B981',
    },
    completedText: {
        color: '#059669',
        fontWeight: '600',
    },
});

export default QuickActionsComponent;