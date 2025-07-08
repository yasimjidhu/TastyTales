import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import recipeReducer from '../store/slices/recipe';
import userReducer from '../store/slices/user'
import notificationReducer from '../store/slices/notification'
import persistedRecipeReducer from './persist';

const store = configureStore({
  reducer: {
    recipes: persistedRecipeReducer,
    user: userReducer,
    notifications:notificationReducer
  },
});

export const persistor = persistStore(store);
export default store;
