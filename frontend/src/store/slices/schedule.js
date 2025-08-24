// store/slices/scheduleSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;
const getToken = async () => await AsyncStorage.getItem("token");

/* ---------------------- THUNKS ---------------------- */

// Fetch schedules for a kitchen
export const fetchSchedules = createAsyncThunk(
    "schedule/fetch",
    async (kitchenId, { getState, rejectWithValue }) => {
        const token = await getToken();
        try {
            const res = await fetch(`${API_URL}/api/schedules/${kitchenId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to fetch schedules");
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Add schedule
export const addSchedule = createAsyncThunk(
    "schedule/add",
    async (schedule, { getState, rejectWithValue }) => {
        const token = await getToken();
        try {
            const kitchenId = getState().kitchen?.kitchen?._id;

            const res = await fetch(`${API_URL}/api/schedules/${kitchenId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(schedule),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to add schedule");
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Update schedule
export const updateSchedule = createAsyncThunk(
    "schedule/update",
    async ({ scheduleId, updates }, { rejectWithValue }) => {
        const token = await getToken();
        try {
            const res = await fetch(`${API_URL}/api/schedules/${scheduleId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updates),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update schedule");
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Delete schedule
export const deleteSchedule = createAsyncThunk(
    "schedule/delete",
    async (scheduleId, { rejectWithValue }) => {
        const token = await getToken();
        try {
            const res = await fetch(`${API_URL}/api/schedules/${scheduleId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete schedule");
            }
            return scheduleId;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

/* ---------------------- SLICE ---------------------- */

const scheduleSlice = createSlice({
    name: "schedule",
    initialState: {
        schedules: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearSchedules: (state) => {
            state.schedules = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchSchedules.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSchedules.fulfilled, (state, action) => {
                state.loading = false;
                state.schedules = action.payload;
            })
            .addCase(fetchSchedules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add
            .addCase(addSchedule.fulfilled, (state, action) => {
                state.schedules.unshift(action.payload); // latest first
            })

            // Update
            .addCase(updateSchedule.fulfilled, (state, action) => {
                const idx = state.schedules.findIndex(
                    (s) => s._id === action.payload._id
                );
                if (idx !== -1) state.schedules[idx] = action.payload;
            })

            // Delete
            .addCase(deleteSchedule.fulfilled, (state, action) => {
                state.schedules = state.schedules.filter(
                    (s) => s._id !== action.payload
                );
            });
    },
});

export const { clearSchedules } = scheduleSlice.actions;
export default scheduleSlice.reducer;
