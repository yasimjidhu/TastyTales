import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import recipeReducer from './slices/recipe';

const recipePersistConfig = {
  key: 'recipe',
  storage: AsyncStorage,
  whitelist: ['madeIt', 'recentlyViewed'], 
};

const persistedRecipeReducer = persistReducer(recipePersistConfig, recipeReducer);

export default persistedRecipeReducer;
// 