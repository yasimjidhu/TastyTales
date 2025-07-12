import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  getMealPlan,
  saveMealPlan,
} from "../store/slices/mealPlan";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MealPlanner = () => {
  const dispatch = useDispatch();
  const mealPlan = useSelector((state) => state.mealPlan?.data);
  const [localPlan, setLocalPlan] = useState({});

  useEffect(() => {
    dispatch(getMealPlan());
  }, []);

  useEffect(() => {
    if (mealPlan?.meals) setLocalPlan(mealPlan.meals);
  }, [mealPlan]);

  const handleSelectRecipe = (day, type) => {
    const recipeId = undefined;
    const updated = {
      ...localPlan,
      [day]: {
        ...(localPlan[day] || {}),
        [type]: recipeId,
      },
    };
    setLocalPlan(updated);
    dispatch(setLocalPlan({ ...mealPlan, meals: updated }));
  };

  const handleSave = () => {
    dispatch(
      saveMealPlan({
        weekStart: new Date().toISOString().split("T")[0],
        meals: localPlan,
      })
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {days.map((day) => (
        <View key={day} style={styles.dayRow}>
          <Text style={styles.dayText}>{day}</Text>
          {["breakfast", "lunch", "dinner"].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => handleSelectRecipe(day, type)}
              style={styles.mealBtn}
            >
              <Text style={styles.mealText}>
                {localPlan?.[day]?.[type] || `Select ${type}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Plan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  dayRow: {
    marginBottom: 20
  },
  dayText: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6
  },
  mealBtn: {
    padding: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    marginBottom: 8
  },
  mealText: {
    color: "#2C3E50"
  },
  saveBtn: {
    backgroundColor: "#3498DB",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30
  },
  saveText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600"
  }
});

export default MealPlanner;