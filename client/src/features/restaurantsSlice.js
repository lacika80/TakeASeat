import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/index";

const initialState = {list:null, status:null, message:null};
export const getMyRestaurants = createAsyncThunk("restaurant", async () => {
    const response = await api.getMyRestaurants();
    return { data: response.data, status: response.status, error: response?.error };
});
export const createRestaurant = createAsyncThunk("restaurant/create", async (formData) => {
    const response = await api.createRestaurant(formData);
    console.log(response);
    return { data: response.data, status: response.status, error: response?.error };
});
const restaurantsSlice = createSlice({
    name: "restaurants",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getMyRestaurants.fulfilled, (state, action) => {
                if (action.payload.error) {
                    state.status = "failed";
                    state.message = action.payload.error;
                    delete state.list;
                } else {
                    state.list = action.payload.data;
                    state.status = "succeeded";
                    delete state.error;
                }
            })
            .addCase(getMyRestaurants.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(getMyRestaurants.rejected, (state, action) => {
                state.status = "failed";
                state.message = action.error.message;
                delete state.list;
            })
    },
});

export default restaurantsSlice.reducer;
