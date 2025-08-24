// store/slices/expensesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;
const getToken = async () => await AsyncStorage.getItem("token");

/* ---------------------- THUNKS ---------------------- */

// Fetch all expenses
export const fetchExpenses = createAsyncThunk(
    "expenses/fetch",
    async (kitchenId, { rejectWithValue }) => {
        const token = await getToken();
        try {
            const res = await fetch(`${API_URL}/api/expenses/${kitchenId}/expenses`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Add new expense
export const addExpense = createAsyncThunk(
    "expenses/add",
    async ({ kitchenId, expense }, { rejectWithValue }) => {
        const token = await getToken();
        try {

            const res = await fetch(`${API_URL}/api/expenses/${kitchenId}/expenses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(expense),
            });
            const data = await res.json();
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Update existing expense
export const updateExpense = createAsyncThunk(
    "expenses/update",
    async ({ kitchenId, expenseId, updates }, { rejectWithValue }) => {
        const token = await getToken();
        try {
            const res = await fetch(
                `${API_URL}/api/expenses/${kitchenId}/expenses/${expenseId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(updates),
                }
            );
            const data = await res.json();
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Delete expense
export const deleteExpense = createAsyncThunk(
    "expenses/delete",
    async ({ kitchenId, expenseId }, { rejectWithValue }) => {
        const token = await getToken();
        try {
            const res = await fetch(
                `${API_URL}/api/expenses/${kitchenId}/expenses/${expenseId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json();
            return { expenseId, balances: data.balances }; // Return ID + updated balances
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Fetch balances
export const fetchBalances = createAsyncThunk(
    "expenses/fetchBalances",
    async (kitchenId, { rejectWithValue }) => {
        const token = await getToken();
        try {
            const res = await fetch(
                `${API_URL}/api/expenses/${kitchenId}/balances`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

/* ---------------------- SLICE ---------------------- */

const expensesSlice = createSlice({
    name: "expenses",
    initialState: {
        expenses: [],
        balances: {},
        members: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch expenses
            .addCase(fetchExpenses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.loading = false;
                state.expenses = action.payload.expenses;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add expense
            .addCase(addExpense.fulfilled, (state, action) => {
                state.expenses.unshift(action.payload.expense); // adds at the beginning
                state.balances = action.payload.balances;
            })

            // Update expense
            .addCase(updateExpense.fulfilled, (state, action) => {
                const updatedExpense = action.payload.expense;
                const index = state.expenses.findIndex((e) => e.id === updatedExpense.id);
                if (index !== -1) state.expenses[index] = updatedExpense;
                state.balances = action.payload.balances;
            })

            // Delete expense
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.expenses = state.expenses.filter(
                    (e) => e._id !== action.payload.expenseId
                );
                state.balances = action.payload.balances;
            })

            // Fetch balances
            .addCase(fetchBalances.fulfilled, (state, action) => {
                state.members = action.payload.members;
                state.balances = action.payload.balances;
            });
    },
});

export default expensesSlice.reducer;
