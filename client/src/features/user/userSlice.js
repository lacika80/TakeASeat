import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../api/index";
import axios from "axios";

const initialState = {
    id: null,
    name: null,
    email: null,
    token: null,
};

const USER_URL = "http://localhost:5000/user/signin";

export const signin = createAsyncThunk("user/signin", async (formData) => {
    const response = await api.signIn(formData);
    return response.data;
});

export const signup = createAsyncThunk("user/signup", async (formData) => {
    console.log(formData);
    const response = await api.signUp(formData);
    return response.data;
});

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginWithToken(state) {
            const ls = JSON.parse(localStorage.getItem("profile"));
            state.id = ls.result._id;
            state.name = ls.result.name;
            state.email = ls.result.email;
            state.token = ls.token;
        },
        logout: () => {
            localStorage.clear();
            return initialState;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(signin.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(signin.fulfilled, (state, action) => {
                state.status = "succeeded";
                localStorage.setItem("profile", JSON.stringify({ ...action?.payload }));
                state.id = action.payload.result._id;
                state.name = action.payload.result.name;
                state.email = action.payload.result.email;
                state.token = action.payload.token;
            })
            .addCase(signin.rejected, (state, action) => {
                state.status = "failed";
                state.user.error = action.error.message;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.status = "succeeded";
                localStorage.setItem("profile", JSON.stringify({ ...action?.payload }));
                state.id = action.payload.result._id;
                state.name = action.payload.result.name;
                state.email = action.payload.result.email;
                state.token = action.payload.token;
            });
    },
});

export const getStatus = (state) => state.user.status;
export const { logout, loginWithToken } = userSlice.actions;
export default userSlice.reducer;
