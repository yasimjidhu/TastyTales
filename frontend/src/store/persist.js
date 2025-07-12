import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import recipeReducer from './slices/recipe';
import groceryReducer from './slices/grocery'

const recipePersistConfig = {
  key: 'recipe',
  storage: AsyncStorage,
  whitelist: ['madeIt', 'recentlyViewed',], 
};

const groceryPersistConfig = {
  key:'grocery',
  storage:AsyncStorage,
  whitelist:['list']
}

export const persistedRecipeReducer = persistReducer(recipePersistConfig, recipeReducer);
export const persistedGroceryReducer = persistReducer(groceryPersistConfig,groceryReducer)

