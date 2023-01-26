import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/index";
import axios from "axios";
import jwtDecode from "jwt-decode";

const initialState = () => {
    const ls = JSON.parse(localStorage.getItem("profile"));
    if (ls) {
        const decodedToken = jwtDecode(ls.token);
        if (decodedToken.exp * 1000 > new Date().getTime()) {
            return {
                user: {
                    id: ls.user._id,
                    firstName: ls.user.first_name,
                    lastName: ls.user.last_name,
                    email: ls.user.email,
                    globalPermission: ls.user.global_permission,
                    isVerified: ls.user.is_verified,
                },
                token: ls.token,
            };
        }
    }
    return { user: null, token: null };
};

export const signin = createAsyncThunk("auth/signin", async (formData) => {
    const response = await api.signIn(formData);
    return response.data;
});

export const signup = createAsyncThunk("auth/signup", async (formData) => {
    const response = await api.signUp(formData);
    return response.data;
});

export const forgottenPW = createAsyncThunk("auth/forgottenpw", async (formData) => {
    const response = await api.forgottenPW(formData);
    return response.data;
});
export const relogin = createAsyncThunk("auth/relogin", async () => {
    const response = await api.relogin();
    return response;
});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginWithToken(state) {
            const ls = JSON.parse(localStorage.getItem("profile"));

            state.user.id = ls.user._id;
            state.user.firstName = ls.user.first_name;
            state.user.lastName = ls.user.last_name;
            state.user.name = ls.user.name;
            state.user.email = ls.user.email;
            state.user.isVerified = ls.user.is_verified;
            state.token = ls.token;
        },
        logout: () => {
            console.log("bent");
            localStorage.clear();
            return initialState();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signin.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(signin.fulfilled, (state, action) => {
                state.status = "succeeded";
                localStorage.setItem("profile", JSON.stringify({ ...action?.payload }));
                state.user = {
                    id: action.payload.user._id,
                    firstName: action.payload.user.first_name,
                    lastName: action.payload.user.last_name,
                    email: action.payload.user.email,
                    globalPermission: action.payload.user.global_permission,
                    isVerified: action.payload.user.is_verified,
                };
                state.token = action.payload.token;
            })
            .addCase(signin.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.status = "succeeded";
                localStorage.setItem("profile", JSON.stringify({ ...action?.payload }));

                state.user.id= action.payload.user._id,
                state.user.firstName= action.payload.user.first_name,
                state.user.lastName= action.payload.user.last_name,
                state.user.email= action.payload.user.email,
                state.user.globalPermission= action.payload.user.global_permission,
                state.user.isVerified= action.payload.user.is_verified
            })
           .addCase(relogin.fulfilled, (state, action) => {
              state.status = "succeeded";
                localStorage.setItem("profile", JSON.stringify({ ...action.payload.data }));

                state.user.id= action.payload.data.user._id,
                state.user.firstName= action.payload.data.user.first_name,
                state.user.lastName= action.payload.data.user.last_name,
                state.user.email= action.payload.data.user.email,
                state.user.globalPermission= action.payload.data.user.global_permission,
                state.user.isVerified= action.payload.data.user.is_verified
            })
    },
});

export const selectCurrentUser = (state) => state.auth.user;
export const getStatus = (state) => state.status;
export const { logout, loginWithToken } = authSlice.actions;
export default authSlice.reducer;
