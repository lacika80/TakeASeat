import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/index";
import { logout } from "./authSlice";

const initialState = {};

export const getAllUser = createAsyncThunk("admin/getalluser", async (_,thunkAPI) => {
    const response = await api.getAllUser();
    if (response.statusCode == 403) {
        thunkAPI.dispatch(logout())
        return { error: "Forbidden" };
    } else return { data: response.data, status: response.status, error: response?.errormessage };
});
export const modifyGPerm = createAsyncThunk("admin/modifygperm", async (data) => {
    console.log(await api.modifyGPerm(data));
});

export const userListSlice = createSlice({
    name: "userList",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getAllUser.fulfilled, (state, action) => {
                console.log(action.payload);
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
            });
    },
});

export default userListSlice.reducer;
