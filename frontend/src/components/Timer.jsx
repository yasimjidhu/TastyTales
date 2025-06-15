import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Vibration, StyleSheet } from 'react-native';

export const TimerComponent = ({ stepIndex = 0 }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Timer countdown effect
    useEffect(() => {
        let interval = null;
        if (isTimerRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => {
                    if (timeLeft <= 1) {
                        setIsTimerRunning(false);
                        // Timer finished - alert and vibrate
                        Alert.alert(
                            "⏰ Timer Finished!",
                            `Your step ${stepIndex + 1} timer has finished.`,
                            [{ text: "OK", onPress: () => {} }]
                        );
                        Vibration.vibrate([0, 500, 200, 500]);
                        return 0;
                    }
                    return timeLeft - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft, stepIndex]);

    // Timer handlers
    const startTimer = (minutes) => {
        setTimeLeft(minutes * 60);
        setIsTimerRunning(true);
        Alert.alert("Timer Started", `${minutes} minute timer started for step ${stepIndex + 1}!`);
    };

    const startCustomTimer = () => {
        Alert.prompt(
            "Custom Timer",
            "Enter minutes:",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Start", 
                    onPress: (minutes) => {
                        const mins = parseInt(minutes);
                        if (mins && mins > 0 && mins <= 120) {
                            startTimer(mins);
                        } else {
                            Alert.alert("Invalid Input", "Please enter a valid number (1-120 minutes).");
                        }
                    }
                }
            ],
            "plain-text",
            "",
            "numeric"
        );
    };

    const stopTimer = () => {
        setIsTimerRunning(false);
        setTimeLeft(0);
        Alert.alert("Timer Stopped", "Timer has been stopped.");
    };

    // Format timer display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.timerContainer}>
            <Text style={styles.sectionTitle}>
                ⏱️ Step Timer {isTimerRunning && `- ${formatTime(timeLeft)}`}
            </Text>
            {isTimerRunning ? (
                <View style={styles.timerRow}>
                    <TouchableOpacity 
                        style={[styles.timerButton, styles.activeTimer]} 
                        onPress={stopTimer}
                    >
                        <Text style={[styles.timerButtonText, styles.stopButtonText]}>
                            Stop Timer
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.timerDisplay}>
                        <Text style={styles.timerDisplayText}>{formatTime(timeLeft)}</Text>
                    </View>
                </View>
            ) : (
                <View style={styles.timerRow}>
                    <TouchableOpacity style={styles.timerButton} onPress={() => startTimer(5)}>
                        <Text style={styles.timerButtonText}>5 min</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.timerButton} onPress={() => startTimer(10)}>
                        <Text style={styles.timerButtonText}>10 min</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.timerButton} onPress={() => startTimer(15)}>
                        <Text style={styles.timerButtonText}>15 min</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.timerButton} onPress={startCustomTimer}>
                        <Text style={styles.timerButtonText}>Custom</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: 12,
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
    activeTimer: {
        backgroundColor: '#FEE2E2',
        borderColor: '#F87171',
    },
    stopButtonText: {
        color: '#DC2626',
    },
    timerDisplay: {
        flex: 2,
        backgroundColor: '#1F2937',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    timerDisplayText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default TimerComponent;