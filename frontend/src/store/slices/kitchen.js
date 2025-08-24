// store/slices/kitchenSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;
const getToken = async () => await AsyncStorage.getItem("token");

/* ---------------------- THUNKS ---------------------- */

// Create kitchen
export const createKitchen = createAsyncThunk(
  "kitchen/create",
  async (payload, { rejectWithValue }) => {
    const token = await getToken();
    try {
      const res = await fetch(`${API_URL}/api/kitchens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create kitchen");
      return data.kitchen;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Join kitchen
export const joinKitchen = createAsyncThunk(
  "kitchen/join",
  async ({ kitchenId, inviteCode }, { rejectWithValue }) => {
    const token = await getToken();
    try {
      const res = await fetch(`${API_URL}/api/kitchens/${kitchenId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inviteCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join kitchen");
      return data.kitchen;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


// Fetch kitchen details
export const fetchKitchen = createAsyncThunk(
  "kitchen/fetch",
  async (kitchenId, { rejectWithValue }) => {
    const token = await getToken();
    try {
      const res = await fetch(`${API_URL}/api/kitchens/${kitchenId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch kitchen");
      return data.kitchen;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ---------------------- SLICE ---------------------- */

const kitchenSlice = createSlice({
  name: "kitchen",
  initialState: {
    kitchen: null,
    kitchenId: null,
    members: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearKitchen: (state) => {
      state.kitchen = null;
      state.members = [];
      state.kitchenId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createKitchen.pending, (state) => {
        state.loading = true;
      })
      .addCase(createKitchen.fulfilled, (state, action) => {
        state.loading = false;
        state.kitchen = action.payload;
        state.kitchenId = action.payload._id; 
        state.members = action.payload.members;
      })
      .addCase(createKitchen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Join
      .addCase(joinKitchen.pending, (state) => {
        state.loading = true;
      })
      .addCase(joinKitchen.fulfilled, (state, action) => {
        state.loading = false;
        state.kitchen = action.payload;
        state.members = action.payload.members;
      })
      .addCase(joinKitchen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch
      .addCase(fetchKitchen.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchKitchen.fulfilled, (state, action) => {
        console.log('fetchkitchen payload ',action.payload)
        state.loading = false;
        state.kitchen = action.payload;
        state.kitchenId = action.payload._id;
        state.members = action.payload.members;
      })
      .addCase(fetchKitchen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearKitchen } = kitchenSlice.actions;
export default kitchenSlice.reducer;
