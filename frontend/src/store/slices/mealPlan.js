import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL

const getToken = async () => await AsyncStorage.getItem("token");

export const getMealPlan = createAsyncThunk(
    'mealPlan/getMealPlan',
    async (_, { rejectWithValue }) => {
        try {
            const token = await getToken()
            const response = await fetch(`${API_URL}/api/mealPlan`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.error || 'Failed to fetch meal plan');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Something went wrong');
        }
    }
);


export const saveMealPlan = createAsyncThunk(
    'mealPlan/saveMealPlan',
    async (mealData, { rejectWithValue }) => {
        try {
            const token = await getToken()
            const response = await fetch(`${API_URL}/api/mealPlan`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify( mealData ),
            });
            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.error || 'Failed to fetch meal plan');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Something went wrong');
        }
    }
);

const mealPlanSlice = createSlice({
    name:"mealPlan",
    initialState:{
        data:null,
        loading:false,
        error:null
    },
    reducers:{
        setLocalMealPlan(state,action){
            state.data = action.payload
        }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(getMealPlan.pending,(state,action)=>{
                state.loading = true
                state.error = null
            })
            .addCase(getMealPlan.fulfilled,(state,action)=>{
                state.data = action.payload
                state.loading = false
            })
            .addCase(getMealPlan.rejected,(state,action)=>{
                state.loading = false
                state.error = action.payload
            })
            .addCase(saveMealPlan.fulfilled,(state,action)=>{
                state.data = action.payload
            })
    }
})

export const {setLocalMealPlan} = mealPlanSlice.actions
export default mealPlanSlice.reducer