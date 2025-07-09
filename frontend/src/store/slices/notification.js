import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    try {
        console.log('fetch notificatoin called in slice')
      const res = await fetch(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.error || "Failed to fetch notifications");
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message || "Something went wrong");
    }
  }
);

export const updateExpoToken = createAsyncThunk(
  "notifications/updateExpoToken",
  async (expoToken, { rejectWithValue }) => {
    try {
      console.log('update expo token called',expoToken)
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/update-expo-token`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ expoToken }),
      });

      if (!res.ok) throw new Error("Failed to update expo token");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/notifications/markAllRead`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.error || "Failed to mark notifications as read");
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message || "Something went wrong");
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (id, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.error || "Failed to delete notification");
      }
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Something went wrong");
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    unreadCount:0,
    loading: false,
    error: null,
  },
  reducers: {
    setNotifications:(state,action)=>{
        state.notifications = action.payload
        state.unreadCount = action.payload.filter(n => !n.read).length;
    },
    markAllRead:(state)=>{
        state.notifications = state.notifications.map(n=> ({...n,read:true}))
        state.unreadCount = 0
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.read).length
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
        state.unreadCount = 0
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter((n) => n._id !== action.payload);
        state.unreadCount = state.notifications.filter(n => !n.read).length
      });
  },
});

export const { setNotifications,markAllRead,clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
