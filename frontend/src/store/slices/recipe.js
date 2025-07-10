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
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/recipes/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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

export const addRecipe = createAsyncThunk(
  'recipes/addRecipe',
  async (recipeData, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(recipeData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to add recipe');
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
          'Authorization': `Bearer ${token}`,
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
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/category/${category}?page=${page}&limit=${10}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong during search');
    }
  }
);

export const fetchWeekRecipes = createAsyncThunk(
  "recipes/fetchWeekRecipes",
  async (_, { rejectWithValue }) => {
    try {
      console.log('fetch week recipes called')
      const response = await fetch(`${API_URL}/api/recipes/week`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'failed to retrieve top recipes of the week');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch recipes of the week");
    }
  }
);

// GET Made It Recipes
export const fetchMadeItRecipes = createAsyncThunk(
  "recipes/fetchMadeItRecipes",
  async (_, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/recipes/made-it`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to fetch Made It recipes");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch Made It recipes");
    }
  }
);

export const addMadeItRecipe = createAsyncThunk(
  "recipes/addMadeItRecipe",
  async (recipeId, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/recipes/madeIt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ recipeId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to mark recipe as Made It");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to mark recipe as Made It");
    }
  }
);

export const saveOrUnsaveRecipe = createAsyncThunk(
  'recipes/saveOrUnsaveRecipe',
  async (recipeId, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/api/recipes/${recipeId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to save/unsave recipe');
      }
      const data = await response.json();
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const fetchSavedRecipes = createAsyncThunk(
  "recipes/fetchSavedRecipes",
  async (_, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    try {
      console.log('fetch saved recipes called')
      const response = await fetch(`${API_URL}/api/recipes/saved`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to fetch saved recipes");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const fetchLikedRecipes = createAsyncThunk(
  "recipes/fetchLikedRecipes",
  async (_, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/recipes/liked`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to fetch liked recipes");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const fetchSuggestedRecipes = createAsyncThunk(
  "recipes/fetchSuggestions",
  async (availableIngredients) => {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/recipes/suggest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ availableIngredients }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.error || "Failed to fetch suggested recipes");

    }
    const data = await response.json();
    return data
  }
);

export const fetchPopularRecipes = createAsyncThunk(
  "recipes/fetchPopular",
  async (_, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem('token')
    try {
      const response = await fetch(`${API_URL}/api/recipes/popular`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to fetch popular recipes");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch popular recipes");
    }
  }
)



const initialState = {
  recipes: [],
  loading: false,
  error: null,
  searchResults: [],
  weekRecipes: [],
  recentlyViewed: [],
  savedRecipes: [],
  popularRecipes: [],
  likedRecipes : [],
  madeIt: [],
  suggestions: [],
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
    removeRecipe: (state, action) => {
      state.recipes = state.recipes.filter(recipe => recipe._id !== action.payload);
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    addRecentlyViewed: (state, action) => {
      const existing = state.recentlyViewed.find(r => r._id === action.payload._id);
      if (!existing) {
        state.recentlyViewed.unshift(action.payload);
        if (state.recentlyViewed.length > 3) {
          state.recentlyViewed.pop(); // Keep only the last 10 viewed recipes
        }
      }
    },
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = [];
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    }
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
      })
      .addCase(fetchWeekRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeekRecipes.fulfilled, (state, action) => {
        state.weekRecipes = action.payload;
        state.loading = false;
      })
      .addCase(fetchWeekRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMadeItRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMadeItRecipes.fulfilled, (state, action) => {
        state.madeIt = action.payload;
        state.loading = false;
      })
      .addCase(fetchMadeItRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addMadeItRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMadeItRecipe.fulfilled, (state, action) => {
        const exists = state.madeIt.find(r => r._id === action.payload._id);
        if (!exists) {
          state.madeIt.unshift(action.payload);
        }
        state.loading = false;
      })
      .addCase(addMadeItRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(fetchSavedRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.savedRecipes = action.payload;
      })
      .addCase(fetchSavedRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLikedRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikedRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.likedRecipes = action.payload;
      })
      .addCase(fetchLikedRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(saveOrUnsaveRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveOrUnsaveRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.savedRecipes = action.payload.savedRecipes;

        const recipeId = action.meta.arg;
        const { savesCount } = action.payload;

        const recipeIndex = state.recipes.findIndex(r => r._id === recipeId);
        if (recipeIndex !== -1) {
          state.recipes[recipeIndex].savesCount = savesCount;
        }

        const popularIndex = state.popularRecipes.findIndex(r => r._id === recipeId);
        if (popularIndex !== -1) {
          state.popularRecipes[popularIndex].savesCount = savesCount;
        }
      })
      .addCase(saveOrUnsaveRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSuggestedRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuggestedRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchSuggestedRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPopularRecipes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPopularRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.popularRecipes = action.payload;
      })
      .addCase(fetchPopularRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

  },
});

export const {
  setRecipes,
  removeRecipe,
  clearSearchResults,
  addRecentlyViewed,
  clearRecentlyViewed,
  clearSuggestions
} = recipeSlice.actions;

export default recipeSlice.reducer;
