import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import recipeReducer from '../store/slices/recipe';
import userReducer from '../store/slices/user'
import groceryReducer from '../store/slices/grocery'
import notificationReducer from '../store/slices/notification'

import {persistedRecipeReducer,persistedGroceryReducer} from './persist';

const store = configureStore({
  reducer: {
    user: userReducer,
    recipes: persistedRecipeReducer,
    grocery:persistedGroceryReducer,
    notifications:notificationReducer
  },
  middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware({
      serializableCheck:false,
    }),
});

export const persistor = persistStore(store);
export default store;
