// ⚛️ Frontend - Redux Slice (store/slices/inventory.js)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;

const getToken = async () => await AsyncStorage.getItem("token");

// Fetch all inventory items
export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",
  async (kitchenId, { getState, rejectWithValue }) => {
    const token = await getToken();

    try {
      const res = await fetch(`${API_URL}/api/inventory/${kitchenId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Add new inventory item
export const addInventoryItem = createAsyncThunk(
  "inventory/addItem",
  async (item, { getState, rejectWithValue }) => {
    const token = await getToken();
    const kitchenId = getState().kitchen?.kitchen?._id;

    try {
      const res = await fetch(`${API_URL}/api/inventory/item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...item, kitchenId }), // 👈 attach kitchenId
      });

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Update inventory item
export const updateInventoryItem = createAsyncThunk(
  "inventory/updateItem",
  async ({ itemId, updates }, { rejectWithValue }) => {
      const token = await getToken();
    try {
      const res = await fetch(`${API_URL}/api/inventory/item/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data =  await res.json();
      return data
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete inventory item
export const deleteInventoryItem = createAsyncThunk(
  "inventory/deleteItem",
  async (itemId, { rejectWithValue }) => {
    const token = await getToken();
    try {
      const res = await fetch(`${API_URL}/api/inventory/item/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data =  await res.json();
      return data
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Slice
const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addInventoryItem.fulfilled, (state, action) => {
        state.items.push(action.payload); // since backend returns newItem
      })
      // Update
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteInventoryItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload.item._id);
      });
  },
});

export default inventorySlice.reducer;
