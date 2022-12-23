import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, Outlet, redirect, useHistory, useLocation, useNavigate } from "react-router-dom";
import decode from "jwt-decode";
import { logout, loginWithToken } from "../../features/user/userSlice";

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const ls = JSON.parse(localStorage.getItem("profile"));
        if (ls) {
            const decodedToken = decode(ls.token);
            if (decodedToken.exp * 1000 < new Date().getTime()) {
                dispatch(logout());
            }else if (user.id == null) {
                dispatch(loginWithToken())
            }
        }else if (user.id != null) {
            dispatch(logout());
        }
    }, [dispatch, location]);

    useEffect(() => {
        if (location.pathname == "/" && user.id == null) navigate("/auth");
        else if (location.pathname == "/" && user.id != null) navigate("/choose");
    }, [location]);

    return <Outlet />;
};

export default Home;
