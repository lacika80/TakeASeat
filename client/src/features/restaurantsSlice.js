import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/index";

const initialState = {
    list: null,
    status: null,
    message: null,
    active: null,
    /* active: {
        tables: [
            {
                id: 1121,
                name: "beltér",
                tables: [
                    [
                        { id: 1, name: "asztal 1/1", posx: 1, posy: 1, seats: 6, space: 1121 },
                        { id: 2, name: "asztal 1/2", posx: 1, posy: 2, seats: 3, space: 1121 },
                        { id: 3, name: "asztal 1/3", posx: 1, posy: 3, seats: 4, space: 1121 },
                    ],
                    [
                        { id: 4, name: "asztal 2/1", posx: 2, posy: 1, seats: 2, space: 1121 },
                        { id: 5, name: "asztal 2/2", posx: 2, posy: 2, seats: 1, space: 1121 },
                    ],
                    [{ id: 6, name: "asztal 3/1", posx: 3, posy: 1, seats: 1, space: 1121 }],
                ],
            },
        ],
        tableOpts: ["kint", "bent", "ablaknál", "dohányzó", "nem dohányzó"],
    }, */
};
export const getMyRestaurants = createAsyncThunk("restaurant", async (_, { rejectWithValue }) => {
    try {
        const response = await api.getMyRestaurants();
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});
export const createRestaurant = createAsyncThunk("restaurant/create", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.createRestaurant(formData);
        console.log(response);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const getActive = createAsyncThunk("restaurant/getActive", async (restId, { rejectWithValue }) => {
    try {
        const response = await api.getActiveRest(restId);
        console.log(response);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});

const restaurantsSlice = createSlice({
    name: "restaurants",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getMyRestaurants.fulfilled, (state, action) => {
                state.list = action.payload.data;
                state.status = "succeeded";
            })
            .addCase(getMyRestaurants.pending, (state, action) => {
                state.status = "loading";
                delete state.error;
            })
            .addCase(getMyRestaurants.rejected, (state, action) => {
                console.log(action);
                delete state.list;
                state.status = "failed";
                state.error = action.payload.data.error;
            })
            .addCase(getActive.pending, (state, action) => {
                state.status = "loading";
                state.error = null;
                state.active = null;
            })
            .addCase(getActive.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.active = action.payload.data.restaurant;
            })
            .addCase(getActive.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload.data.error;
            })
            .addCase(createRestaurant.pending, (state, action) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(createRestaurant.fulfilled, (state, action) => {
                state.status = "succeeded";
            })
            .addCase(createRestaurant.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload.data.error;
            });
    },
});

export default restaurantsSlice.reducer;
