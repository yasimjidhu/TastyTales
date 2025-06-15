import { configureStore } from '@reduxjs/toolkit';
import recipeReducer from '../store/slices/recipe';
import userReducer from '../store/slices/user'

const store = configureStore({
  reducer: {
    recipes: recipeReducer,
    user: userReducer
  },
});

export default store;
