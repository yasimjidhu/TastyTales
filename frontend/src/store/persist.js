import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import recipeReducer from './slices/recipe';
import groceryReducer from './slices/grocery'
import mealPlanReducer from './slices/mealPlan'
import kitchenReducer from './slices/kitchen'
import expenseReducer from './slices/expenses'
import scheduleReducer from './slices/schedule'

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

const kitchenPersistConfig = {
  key:'kitchen',
  storage:AsyncStorage,
  whitelist:['kitchen','kitchenId','members','expenses','balances','schedule','inventory']
}

const expensesPersistConfig = {
  key:'expenses',
  storage:AsyncStorage,
  whitelist:['expenses','balances']
}

const schedulePersistConfig = {
  key:'schedule',
  storage:AsyncStorage,
  whitelist:['schedules']
}


export const persistedRecipeReducer = persistReducer(recipePersistConfig, recipeReducer);
export const persistedGroceryReducer = persistReducer(groceryPersistConfig,groceryReducer)
export const persistedMealPlanReducer = persistReducer(mealPlanPersistConfig,mealPlanReducer)
export const persistedKitchenReducer = persistReducer(kitchenPersistConfig,kitchenReducer)
export const persistedExpenseReducer = persistReducer(expensesPersistConfig,expenseReducer)
export const persistedScheduleReducer = persistReducer(schedulePersistConfig,scheduleReducer)

