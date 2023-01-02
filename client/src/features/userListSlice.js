import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/index";

const initialState = {};

export const getAllUser = createAsyncThunk("admin/getalluser", async () => {
    const response = await api.getAllUser();
    return { data: response.data, status: response.status, error: response?.error };
});
export const modifyGPerm = createAsyncThunk("admin/modifygperm", async (data) => {
    const response = await api.modifyGPerm(data);
    return false;//{ data: response.data, status: response.status, error: response?.error };
});

export const userListSlice = createSlice({
    name: "userList",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getAllUser.fulfilled, (state, action) => {
                console.log(action);
                if (action.payload.error) {
                    state.status = "failed";
                    state.error = action.payload.error;
                    delete state.users;
                } else {
                    state.users = action.payload.data.users;
                    state.status = "succeeded";
                    delete state.error;
                }
            })
            .addCase(getAllUser.pending, (state, action) => {
                state.status = "loading";
                delete state.users;
            })
            .addCase(getAllUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                delete state.users;
            })
    },
});

export default userListSlice.reducer;
