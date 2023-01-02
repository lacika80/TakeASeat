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
                    id: ls.result._id,
                    firstName: ls.result.first_name,
                    lastName: ls.result.last_name,
                    email: ls.result.email,
                    globalPermission: ls.result.global_permission
                },
                token: ls.token,
            };
        }
    }
    console.log("asd");
    return { user: null, token: null };
};

const USER_URL = "http://localhost:5000/user/signin";

export const signin = createAsyncThunk("user/signin", async (formData) => {
    const response = await api.signIn(formData);
    return response.data;
});

export const signup = createAsyncThunk("user/signup", async (formData) => {
    const response = await api.signUp(formData);
    return response.data;
});

export const forgottenPW = createAsyncThunk("user/forgottenpw", async (formData) => {
    const response = await api.forgottenPW(formData);
    return response.data;
});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginWithToken(state) {
            const ls = JSON.parse(localStorage.getItem("profile"));
            state.user.id = ls.result._id;
            state.user.name = ls.result.name;
            state.user.email = ls.result.email;
            state.token = ls.token;
        },
        logout: () => {
            localStorage.clear();
            return initialState();
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
                state.user = {
                    id: action.payload.result._id,
                    firstName: action.payload.result.first_name,
                    lastName: action.payload.result.last_name,
                    email: action.payload.result.email,
                    globalPermission: action.payload.result.global_permission

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
                state.user.id = action.payload.result._id;
                state.user.name = action.payload.result.name;
                state.user.email = action.payload.result.email;
                state.token = action.payload.token;
            });
    },
});

export const selectCurrentUser = (state) => state.auth.user;
export const getStatus = (state) => state.status;
export const { logout, loginWithToken } = authSlice.actions;
export default authSlice.reducer;
