import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/index";
import axios from "axios";
import jwtDecode from "jwt-decode";

const initialState = () => {
    const ls = JSON.parse(localStorage.getItem("profile"));
    try {
        if (ls) {
            const decodedToken = jwtDecode(ls.token);
            if (decodedToken.exp * 1000 > new Date().getTime()) {
                return {
                    user: {
                        id: ls.user.id,
                        firstName: ls.user.first_name,
                        lastName: ls.user.last_name,
                        email: ls.user.email,
                        globalPermission: ls.user.global_permission,
                        isVerified: ls.user.is_verified,
                        lastActiveRest: ls.user.last_active_rest??null,
                    },
                    token: ls.token,
                };
            }
        }
    } catch (error) {
        console.log("drop");
        localStorage.removeItem("profile");
    }
    return { user: null, token: null, error: null };
};

export const signin = createAsyncThunk("auth/signin", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.signIn(formData);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const signup = createAsyncThunk("auth/signup", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.signUp(formData);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const recreateVerifyEmail = createAsyncThunk("auth/recreateVerifyEmail", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.recreateVerifyEmail(formData);
        console.log("response");
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const forgottenPW = createAsyncThunk("auth/forgottenpw", async (formData) => {
    const response = await api.forgottenPW(formData);
    return response.data;
});

export const relogin = createAsyncThunk("auth/relogin", async () => {
    const response = await api.relogin();
    return response;
});

export const verifyEmailCreated = createAsyncThunk("auth/verifyEmailCreated", async () => {
    const response = await api.verifyEmailCreated();
    return response;
});

export const setACtiveRest = createAsyncThunk("auth/setActiveRest", async (restId) => {
    const response = await api.setActiveRest(restId);
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
            state.user.lastActiveRest = ls.user.last_active_rest;
            state.token = ls.token;
        },
        logout: () => {
            localStorage.clear();
            return initialState();
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signin.pending, (state, action) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(signin.fulfilled, (state, action) => {
                state.status = "succeeded";
                console.log(action);
                 localStorage.setItem("profile", JSON.stringify({ ...action.payload.data }));
                state.user = {
                    id: action.payload.data.user.id,
                    firstName: action.payload.data.user.first_name,
                    lastName: action.payload.data.user.last_name,
                    email: action.payload.data.user.email,
                    globalPermission: action.payload.data.user.global_permission,
                    isVerified: action.payload.data.user.is_verified,
                    lastActiveRest: action.payload.data.user.last_active_rest??null,
                };
                state.token = action.payload.data.token;
            })
            .addCase(signin.rejected, (state, action) => {
                state.status = "failed";
                state.user = null;
                state.error = action.payload.data.error;
            })
            .addCase(signup.pending, (state, action) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.status = "succeeded";
                localStorage.setItem("profile", JSON.stringify({ ...action?.payload?.data }));

                state.user = {
                    id: action.payload.data.user.id,
                    firstName: action.payload.data.user.first_name,
                    lastName: action.payload.data.user.last_name,
                    email: action.payload.data.user.email,
                    globalPermission: action.payload.data.user.global_permission,
                    isVerified: action.payload.data.user.is_verified,
                };
            })
            .addCase(signup.rejected, (state, action) => {
                console.log("rejected");
                console.log(action);
                state.status = "failed";
                state.user = null;
                state.error = action.payload.data.error;
            })
            .addCase(relogin.fulfilled, (state, action) => {
                state.status = "succeeded";
                localStorage.setItem("profile", JSON.stringify({ ...action.payload.data }));

                (state.user.id = action.payload.data.user._id),
                    (state.user.firstName = action.payload.data.user.first_name),
                    (state.user.lastName = action.payload.data.user.last_name),
                    (state.user.email = action.payload.data.user.email),
                    (state.user.globalPermission = action.payload.data.user.global_permission),
                    (state.user.isVerified = action.payload.data.user.is_verified);
                state.user.lastActiveRest = action.payload.data.user.last_active_rest;
            })
            .addCase(setACtiveRest.fulfilled, (state, action) => {
                if (action.payload.error) {
                    state.user.lastActiveRest = null;
                } else {
                    state.status = "succeeded";
                    state.lastActiveRest = "alma";
                }
            });
    },
});

export const selectCurrentUser = (state) => state.auth.user;
export const getStatus = (state) => state.status;
export const { logout, loginWithToken, clearError } = authSlice.actions;
export default authSlice.reducer;
