import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/index";

const initialState = { tables: null, status: null, message: null };
const tablesSlice = createSlice({
    name: "tables",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder;
    },
});

export default tablesSlice.reducer;
