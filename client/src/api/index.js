import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

API.interceptors.request.use((req) => {
    if (localStorage.getItem("profile")) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token}`;
    }

    return req;
});

export const signIn = (formData) =>
    API.post("/user/signin", formData).catch(function (error) {
        return { error: error.response.data.error };
    });
export const signUp = (formData) =>
    API.post("/user/signup", formData).catch(function (error) {
        return { error: error.response.data.error };
    });
export const forgottenPW = (formData) =>
    API.post("/user/forgottenpw", formData).catch(function (error) {
        return { error: error.response.data.error };
    });

export const verify = (data) =>
    API.post("/verify", data).catch(function (error) {
        return { error: error.response.data.error };
    });

    export const getEmailFromToken = (data) =>
    API.get(`/verify/getEmail`,{
        params: {
token: data.token        }}).catch(function (error) {
        return { error: error.response.data.error };
    });