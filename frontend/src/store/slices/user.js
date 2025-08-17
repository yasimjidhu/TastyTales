import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL


export const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch user profile');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);




export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Login failed');
      }

      const data = await response.json();
      if (!data.token) {
        return rejectWithValue('No token received from server');
      }
      // Store the token in AsyncStorage
      await AsyncStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
)

export const register = createAsyncThunk(
  'user/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Registration failed');
      }

      const data = await response.json();
      console.log('Register response:', data);
      if (!data.token) {
        return rejectWithValue('No token received from server');
      }
      await AsyncStorage.setItem('token', data.token);

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);


export const submitPreferences = createAsyncThunk(
  "user/submit-preferences",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err?.error || "Failed to save preferences");
      }
      const data = await res.json();
      console.log("Preferences saved successfully:", data);
      return data;
    } catch (e) {
      return rejectWithValue(e.message || "Something went wrong");
    }
  }
);

export const updateUserProfileImage = createAsyncThunk(
  'user/updateProfileImage',
  async ({ userId, imageUri }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/users/${userId}/profile-image`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUri }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Image upload failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ userId, name, phone }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Profile update failed');
      }

      const data = await response.json();
      return data?.user;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const likeOrUnlikeRecipe = createAsyncThunk(
  'user/likeOrUnlikeRecipe',
  async (recipeId, { rejectWithValue }) => {

    const token = await AsyncStorage.getItem('token');

    try {
      console.log('like or unlike alled in slice', recipeId)
      const response = await fetch(`${API_URL}/api/recipes/${recipeId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,

        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to like/unlike recipe');
      }
      const data = await response.json();
      return data?.user;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const followOrUnfollow = createAsyncThunk(
  'user/followOrUnfollow',
  async (authorId, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/users/follow/${authorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,

        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to follow author');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);


const initialState = {
  user: null,
  token: null,
  expoToken:null,
  loading: false,
  imageUploading: false, 
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        console.log('register fulfilled in slice payload', action.payload);
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitPreferences.fulfilled, (state,action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.lastSavedAt = Date.now();
      })
      .addCase(submitPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to save preferences";
      })
      .addCase(updateUserProfileImage.pending, (state) => {
        state.imageUploading = true;
        state.error = null;
      })
      .addCase(updateUserProfileImage.fulfilled, (state, action) => {
        state.imageUploading = false;
        if (state.user) {
          state.user.image = action.payload.user.image; // Update profile image in user state
        }
      })
      .addCase(updateUserProfileImage.rejected, (state, action) => {
        state.imageUploading = false;
        state.error = action.payload;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Update user state with fetched profile
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      }
      )
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.name = action.payload.name; // Update name in user state
          state.user.phone = action.payload.phone; // Update phone in user state
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(likeOrUnlikeRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likeOrUnlikeRecipe.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.likedRecipes = action.payload.likedRecipes; // Update liked recipes in user state
        }
      })
      .addCase(likeOrUnlikeRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(followOrUnfollow.pending, (state) => {
        state.loading = true;
      })
      .addCase(followOrUnfollow.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(followOrUnfollow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setUser } = userSlice.actions;
export default userSlice.reducer;