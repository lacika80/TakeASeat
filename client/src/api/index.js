import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });
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
        return { error: error.response.data.error };
    });
export const relogin = () =>
    API.post("/user/relogin").catch(function (error) {
        return { error: error.response.data.error };
    });
export const signUp = (formData) =>
    API.post("/user/signup", formData).catch(function (error) {
        return { error: error.response.data.error };
    });
export const forgottenPW = (formData) =>
    API.post("/user/forgottenpw", formData).catch(function (error) {
        console.log("catch-ben");
        new Error({ error: error.response.data.error });
    });
export const verify = (data) =>
    API.post("/verify", data).catch(function (error) {
        return { error: error.response.data.error };
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
        return { error: error.response.data.error };
    });
export const createRestaurant = (data) =>
    API.post("restaurant", data).catch(function (error) {
        return { error: error.response.data.error };
    });
export const updateRestaurant = (data) =>
    API.patch("restaurant", data).catch(function (error) {
        return { error: error.response.data.error };
    });
