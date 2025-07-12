// ⚛️ Frontend - Redux Slice (store/slices/groceryList.js)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Constants from "expo-constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;

const getToken = async () => await AsyncStorage.getItem("token");

export const fetchGroceryList = createAsyncThunk("grocery/fetchList", async (_, { rejectWithValue }) => {
  const token = await getToken();
  try {
    const res = await fetch(`${API_URL}/api/grocery`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const addGroceryItem = createAsyncThunk("grocery/addItem", async (item, { rejectWithValue }) => {
  const token = await getToken();
  try {
    const res = await fetch(`${API_URL}/api/grocery/item`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(item),
    });
    return await res.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteGroceryItem = createAsyncThunk("grocery/deleteItem", async (itemId, { rejectWithValue }) => {
  const token = await getToken();
  try {
    const res = await fetch(`${API_URL}/api/grocery/item/${itemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const grocerySlice = createSlice({
  name: "grocery",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchGroceryList.pending, state => {
        state.loading = true;
      })
      .addCase(fetchGroceryList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.items || [];
      })
      .addCase(fetchGroceryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addGroceryItem.fulfilled, (state, action) => {
        state.list = action.payload.items;
      })
      .addCase(deleteGroceryItem.fulfilled, (state, action) => {
        state.list = action.payload.items;
      });
  },
});

export default grocerySlice.reducer;