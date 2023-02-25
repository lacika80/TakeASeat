import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL, timeout: 5000 });
API.interceptors.request.use((req) => {
    if (localStorage.getItem("profile")) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token}`;
    }

    return req;
});

//------------------
//------------------authentication
//------------------
export const signIn = (formData) =>
    API.post("/user/signin", formData).catch(function (error) {
        if (error.message == "Network Error") throw { data: { error: error.message } };
        throw error.response;
    });
export const relogin = () =>
    API.post("/user/relogin").catch(function (error) {
        return { error: error.response.data.error };
    });
export const signUp = (formData) =>
    API.post("/user/signup", formData).catch(function (error) {
        if (error.message == "Network Error") throw { data: { error: error.message } };
        throw error.response;
    });
export const forgottenPW = (formData) =>
    API.post("/user/forgottenpw", formData).catch(function (error) {
        if (error.message == "Network Error") throw { data: { error: error.message } };
        throw error.response;
    });
export const verify = (data) =>
    API.post("/verify", data).catch(function (error) {
        if (error.message == "Network Error") throw { data: { error: error.message } };
        throw error.response;
    });
export const verifyEmailCreated = () =>
    API.get(`/verify/emailCreated`).catch(function (error) {
        if (error.message == "Network Error") throw { data: { error: error.message } };
        throw error.response;
    });
export const recreateVerifyEmail = (formData) =>
    API.post("/user/recreateverifyemail", formData).catch(function (error) {
        if (error.message == "Network Error") throw { data: { error: error.message } };
        throw error.response;
    });

//------------------
//------------------ admin things
//------------------
export const getEmailFromToken = (data) =>
    API.get(`/verify/getEmail`, {
        params: {
            token: data.token,
        },
    }).catch(function (error) {
        return { error: error.response.data.error };
    });
export const getAllUser = () =>
    API.post("/admin/getAllUser").catch(function (error) {
        return { errormessage: error.response.data.error, statusCode: error.response.status };
    });
export const modifyGPerm = (data) =>
    API.post("/admin/modifyGPerm", data).catch(function (error) {
        //if (error.response.status==403) dispatch(logout());
        return { error: error.response.data.error };
    });
//------------------
//------------------restaurant
//------------------
export const getMyRestaurants = () =>
    API.get("restaurant").catch(function (error) {
        if (error.message == "Network Error") throw { data: { error: error.message } };
        throw error.response;
    });
export const createRestaurant = (data) =>
    API.post("restaurant", data).catch(function (error) {
        if (error.message == "Network Error") throw { data: { error: error.message } };
        throw error.response;
    });
export const getActiveRest = (data) =>
    API.get(`/restaurant/${data}`, {
        params: {
            restId: data,
        },
    }).catch(function (error) {
        if (error.message == "Network Error") throw { data: { error: error.message } };
        throw error.response;
    });
export const updateRestaurant = (data) =>
    API.patch("restaurant", data).catch(function (error) {
        return { error: error.response.data.error };
    });
export const setActiveRest = (restId) =>
    API.patch(`user/setActiveRest/${restId}`).catch(function (error) {
        return { error: error.response.data.error };
    });

export const createTable = (data) =>
    API.post(`restaurant/${data.restId}/table`, data).catch(function (error) {
        if (error.message == "Network Error") throw { data: { error: error.message } };
        throw error.response;
    });
export const editTable = (data) =>
    API.patch(`restaurant/${data.restId}/table`, data).catch(function (error) {
        if (error.message == "Network Error") throw { data: { error: error.message } };
        throw error.response;
    });
export const deleteTable = (data) =>
    API.delete(`restaurant/${data.restId}/table`, {
        params: {
            tableId: data.tableId,
        },
    }).catch(function (error) {
        if (error.message == "Network Error") throw { data: { error: error.message } };
        throw error.response;
    });

export const createReservation = (data) =>
    API.post("reservation", data).catch(function (error) {
        if (error.message == "Network Error") throw { data: { error: error.message } };
        throw error.response;
    });
export const guestIsHere = (data) =>
    API.post("reservation/guestIsHere", data).catch(function (error) {
        if (error.message == "Network Error") throw { data: { error: error.message } };
        throw error.response;
    });
