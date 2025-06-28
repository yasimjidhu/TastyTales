import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;

export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/recipes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch recipes');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);
export const fetchRecipe = createAsyncThunk(
  'recipes/fetchRecipe',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/recipes/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch recipe');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const addReview = createAsyncThunk(
  'recipes/addReview',
  async ({ recipeId, rating, comment, userName, userImage }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/recipes/${recipeId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment, userName, userImage }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to add review');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const fetchCategoryWiseRecipes = createAsyncThunk(
  'recipes/getCategoryWiseRecipes',
  async ({ category, page = 1 }, { rejectWithValue }) => {

    try {
      const response = await fetch(`${API_URL}/api/category/${category}?page=${page}&limit=${10}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to retrieve category-wise recipes');
      }
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong while fetching category-wise recipes');
    }
  }
)

export const searchRecipes = createAsyncThunk(
  'recipes/searchRecipes',
  async ({ query, category = '', page = 1 }, { rejectWithValue }) => {
    try {
      console.log('Searching for recipes:', query, 'Category:', category, 'Page:', page);
      const response = await fetch(`${API_URL}/api/recipes/search?q=${query}&category=${category}&page=${page}&limit=10`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Search failed');
      }
      const data = await response.json();
      return data;  // { recipes, total }
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong during search');
    }
  }
);


const initialState = {
  recipes: [],
  loading: false,
  error: null,
  searchResults: [],
  totalPages: 0,
  currentPage: 1,
};

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setRecipes: (state, action) => {
      state.recipes = action.payload;
    },
    addRecipe: (state, action) => {
      state.recipes.push(action.payload);
    },
    removeRecipe: (state, action) => {
      state.recipes = state.recipes.filter(recipe => recipe._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      // fetch single
      .addCase(fetchRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipe.fulfilled, (state, action) => {
        const index = state.recipes.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.recipes[index] = action.payload;
        } else {
          state.recipes.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(fetchRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      }
      )
      .addCase(addReview.fulfilled, (state, action) => {
        const recipeIndex = state.recipes.findIndex(r => r._id === action.payload._id);
        if (recipeIndex !== -1) {
          const recipe = state.recipes[recipeIndex];
          recipe.reviews = action.payload.reviews;
          state.recipes[recipeIndex] = recipe;
        }
        state.loading = false;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add review';
      })
      .addCase(fetchCategoryWiseRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      }
      )
      .addCase(fetchCategoryWiseRecipes.fulfilled, (state, action) => {
        const { recipes, totalPages, currentPage } = action.payload;
        if (currentPage === 1) {
          state.recipes = recipes;
        } else {
          state.recipes = [...state.recipes, ...recipes];
        }
        state.loading = false
        state.totalPages = totalPages;
        state.currentPage = currentPage;

      })
      .addCase(fetchCategoryWiseRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add review';
      }).addCase(searchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchRecipes.fulfilled, (state, action) => {
        const { recipes, totalPages, currentPage } = action.payload;

        if (currentPage === 1) {
          state.searchResults = recipes;
        } else {
          state.searchResults = [...state.searchResults, ...recipes];
        }

        state.loading = false;
        state.totalPages = totalPages;
        state.currentPage = currentPage;
      })
      .addCase(searchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Search failed';
      });
  },
});

export const { setRecipes, addRecipe, removeRecipe } = recipeSlice.actions;
export default recipeSlice.reducer;
