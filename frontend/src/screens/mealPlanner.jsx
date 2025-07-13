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
    const fetchMealPlan = async () => {
      try {
        const result = await dispatch(getMealPlan());
      } catch (error) {
        console.error('❌ Error fetching meal plan:', error);
      }
    };
    
    fetchMealPlan();
  }, []);

  useEffect(() => {
    console.log('🔄 mealPlan state changed:', mealPlan);
    if (mealPlan?.meals) {
      console.log('mealplan meals is stored in redux',mealPlan.meals)
      console.log('📋 Setting local plan with meals:', mealPlan.meals);
      setLocalPlan(mealPlan.meals);
    }
  }, [mealPlan]);

  useEffect(() => {
    console.log('📱 Local plan updated:', localPlan);
  }, [localPlan]);

  const handleSelectRecipe = (day, type) => {
    const recipeId = undefined;
    const updated = {
      ...localPlan,
      [day]: {
        ...(localPlan[day] || {}),
        [type]: recipeId,
      },      
    };
    console.log('🎯 Selecting recipe for', day, type);
    console.log('📝 Updated plan:', updated);
    setLocalPlan(updated);
    dispatch(setLocalPlan({ ...mealPlan, meals: updated }));
  };

  const handleSave = async () => {
    try {
      console.log('💾 Saving meal plan:', localPlan);
      const result = await dispatch(
        saveMealPlan({
          weekStart: new Date().toISOString().split("T")[0],
          meals: localPlan,
        })
      );
      console.log('✅ Meal plan saved:', result);
    } catch (error) {
      console.error('❌ Error saving meal plan:', error);
    }
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