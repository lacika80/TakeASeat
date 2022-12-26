import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/index";

const initialState = {
    link: null,
    validity: null,
    receiver_email: null,
    status: null,
    message: null,
    error: null,
};

export const verify = createAsyncThunk("verify", async (data) => {
    const response = await api.verify(data);
    return {data:response.data, status: response.status, error: response?.error};
});
export const getEmailFromToken = createAsyncThunk("getEmailFromToken", async (data) => {
    const body = { token: data };
    const response = await api.getEmailFromToken(body);
    return {data:response.data, status: response.status, error: response?.error};
});

export const linkSlice = createSlice({
    name: "link",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(verify.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(verify.fulfilled, (state, action) => {
                if (action.payload.error) {
                    state.status = "failed";
                    state.error = action.payload.error;
                } else {
                    state.status = "succeeded";
                    state.message = action.payload.data.message;
                }
            })
            .addCase(verify.rejected, (state, action) => {
                state.status = "failed";
                state.error = "Szerver oldali hiba";
            })


            .addCase(getEmailFromToken.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(getEmailFromToken.fulfilled, (state, action) => {
                if (action.payload.error) {
                    state.status = "failed";
                    state.error = action.payload.error;
                } else {
                    state.status = "succeeded";
                    state.receiver_email = action.payload.data.email;
                    state.validity = action.payload.data.is_valid;

                }
            })
            .addCase(getEmailFromToken.rejected, (state, action) => {
                state.status = "failed";
                state.error = "Szerver oldali hiba";
            });
    },
});

export const getStatus = (state) => state.link.status;
export default linkSlice.reducer;
