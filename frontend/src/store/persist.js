import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import recipeReducer from './slices/recipe';
import groceryReducer from './slices/grocery'
import mealPlanReducer from './slices/mealPlan'

const recipePersistConfig = {
  key: 'recipe',
  storage: AsyncStorage,
  whitelist: ['madeIt', 'recentlyViewed','recipes'], 
};

const groceryPersistConfig = {
  key:'grocery',
  storage:AsyncStorage,
  whitelist:['list']
}

const mealPlanPersistConfig = {
  key:'mealPlan',
  storage:AsyncStorage,
  whitelist:['data']
}

export const persistedRecipeReducer = persistReducer(recipePersistConfig, recipeReducer);
export const persistedGroceryReducer = persistReducer(groceryPersistConfig,groceryReducer)
export const persistedMealPlanReducer = persistReducer(mealPlanPersistConfig,mealPlanReducer)

