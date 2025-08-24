import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import recipeReducer from '../store/slices/recipe';
import userReducer from '../store/slices/user'
import groceryReducer from '../store/slices/grocery'
import mealPlanReducer from '../store/slices/mealPlan'
import kitchenReducer from '../store/slices/kitchen'
import inventoryReducer from '../store/slices/inventory'
import notificationReducer from '../store/slices/notification'

import {persistedRecipeReducer,persistedGroceryReducer,persistedKitchenReducer,persistedExpenseReducer} from './persist'

const store = configureStore({
  reducer: {
    user: userReducer,
    recipes: persistedRecipeReducer,
    grocery:persistedGroceryReducer,
    mealPlan:mealPlanReducer,
    notifications:notificationReducer,
    kitchen: persistedKitchenReducer,
    inventory:inventoryReducer,
    expenses:persistedExpenseReducer,
  },
  middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware({
      serializableCheck:false,
    }),
});

export const persistor = persistStore(store);
export default store;
