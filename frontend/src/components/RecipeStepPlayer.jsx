import { View, Text, Button } from "react-native";
import React from "react";
import * as Speach from "expo-speech";

export default function RecipeStepPlayer({ stepText }) {
  const speak = () => {
    Speach.speak(stepText, {
        language: "en-US",
        rate: 0.8,
        pitch: 1.0,
        volume: 1.0,
    })
  };

  return (
    <View style={{ marginTop: 10 }}>
      <Button title="Listen to this Step" onPress={speak} color="#4ECDC4" />
    </View>
  );
}
