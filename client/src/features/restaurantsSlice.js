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
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const getActive = createAsyncThunk("restaurant/getActive", async (restId, { rejectWithValue }) => {
    try {
        const response = await api.getActiveRest(restId);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const createTable = createAsyncThunk("restaurant/createtable", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.createTable(formData);
        console.log(response);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const createReservation = createAsyncThunk("restaurant/createReservation", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.createReservation(formData);
        console.log(response);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const editTable = createAsyncThunk("restaurant/editTable", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.editTable(formData);
        console.log(response);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});
export const deleteTable = createAsyncThunk("restaurant/deleteTable", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.deleteTable(formData);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});
export const guestIsHere = createAsyncThunk("restaurant/guestIsHere", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.guestIsHere(formData);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});
export const getDetailedReservations = createAsyncThunk("restaurant/getDetailedReservations", async (restId, { rejectWithValue }) => {
    try {
        const response = await api.getDetailedReservations(restId);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});
export const updateRes = createAsyncThunk("restaurant/updateRes", async (res, { rejectWithValue }) => {
    try {
        const response = await api.updateRes(res);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});
export const modifyResTable = createAsyncThunk("restaurant/modifyResTable", async (data, { rejectWithValue }) => {
    try {
        const response = await api.modifyResTable(data);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});
export const delRes = createAsyncThunk("restaurant/delRes", async (data, { rejectWithValue }) => {
    try {
        const response = await api.delRes(data);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});
const restaurantsSlice = createSlice({
    name: "restaurants",
    initialState,
    reducers: {
        clearErr: (state) => {
            state.status = null;
            delete state.error;
        },
    },
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
                delete state.list;
                state.status = "failed";
                state.error = action.payload.data.error;
            })
            .addCase(getActive.pending, (state, action) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getActive.fulfilled, (state, action) => {
                state.status = "succeeded";
                //creating table list with id and name for fast accessing
                action.payload.data.restaurant.tableList = [];
                //table sorting and grouping for grid visualization
                let tableOptsSet = new Set();
                action.payload.data.restaurant.spaces.map((space, index) => {
                    space.tables.sort((a, b) => a.posy - b.posy);
                    space.tables.sort((a, b) => a.posx - b.posx);
                    action.payload.data.restaurant.spaces[index].deletedTables = action.payload.data.restaurant.spaces[index].tables.filter((table) => table.isActive === false);
                    action.payload.data.restaurant.spaces[index].tables = action.payload.data.restaurant.spaces[index].tables.filter((table) => table.isActive === true);
                    action.payload.data.restaurant.tableList.push(...action.payload.data.restaurant.spaces[index].tables.filter((table) => table.isActive === true));
                    //adding to global tableOpts
                    const t2 = [];
                    let last = { posx: false };
                    space.tables.forEach((element) => {
                        element.tableOpts.forEach((opt) => {
                            tableOptsSet.add(opt);
                        });
                        if (last.posx === false || last.posx != element.posx) {
                            t2.push([element]);
                        } else {
                            t2[t2.length - 1].push(element);
                        }
                        last = element;
                    });
                    action.payload.data.restaurant.spaces[index].tables = t2;
                });
                action.payload.data.restaurant.tableOpts = [...tableOptsSet];
                state.active = action.payload.data.restaurant;
                //state.active.permission=0;
            })
            .addCase(getActive.rejected, (state, action) => {
                state.active = null;
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
            })
            .addCase(createTable.pending, (state, action) => {
                //state.status = "loading";
                state.error = null;
            })
            .addCase(createTable.fulfilled, (state, action) => {
                state.status = "succeeded";
            })
            .addCase(createTable.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload.data.error;
            })
            .addCase(getDetailedReservations.pending, (state, action) => {
                state.status = { reservations: "loading" };
                state.active.reservations = null;
            })
            .addCase(getDetailedReservations.fulfilled, (state, action) => {
                state.status = { reservations: "succeeded" };
                state.active.reservations = action.payload.data.reservations;
            });
    },
});

export default restaurantsSlice.reducer;
export const { clearErr } = restaurantsSlice.actions;
