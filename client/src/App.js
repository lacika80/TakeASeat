import React, { useEffect, useState } from "react";
import { createBrowserRouter, createRoutesFromElements, Route, Routes, RouterProvider, Outlet } from "react-router-dom";
import RequireGPerm from "./features/RequireGPerm";

import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Auth from "./components/Auth/Auth";
import Choose from "./components/Choose/Choose";
import Verify from "./components/Verify/Verify";
import NewPassword from "./components/NewPassword/NewPassword";
import Restaurant from "./components/Restaurant/Restaurant";

import { io } from "socket.io-client";
import Admin from "./components/Admin/Admin";
import { Layout } from "./components/Layout/Layout";
import { useDispatch, useSelector } from "react-redux";

import decode from "jwt-decode";
import NoUserGate from "./features/NoUserGate";
import UserList from "./components/Admin/UserList/UserList";
import RequireAuth from "./features/RequireAuth";
import { relogin } from "./features/authSlice";
import RestUserList from "./components/Restaurant/RestUserList";
import RestSettings from "./components/Restaurant/Settings";
import TableList from './components/Restaurant/TableList'

export default function App() {
    const auth = useSelector((state) => state.auth);
    const [socket, setSocket] = useState(null);
    const dispatch = useDispatch();
    //create socket if user is logged in and that isn't created, or destroy when the user isn't logged is
    useEffect(() => {
        if (auth.user && !socket) setSocket(io("http://localhost:5000", { auth: { token: auth.token } }));
        if (!auth.user && socket) setSocket(null);
    }, [auth]);
    //setup the listeners - cleaner not needed because this page is always active
    useEffect(() => {
        if (!socket) return;
        socket.on("connect", () => {
            //console.log(socket.id);
        });
        socket.on("test", (data) => {
            console.log(data);
        });
        socket.on("refresh-user", () => {
            console.log("ok, frissitem");
            dispatch(relogin());
        });
        //socket test for the server direction
        //socket.emit("asd", { as: "ss" });
    }, [socket]);

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="/" element={<NoUserGate />}>
                    {/* public routes */}
                    <Route path="Auth" element={<Auth />} />
                    <Route path="newpassword" element={<NewPassword />} />
                </Route>
                <Route path="verify" element={<Verify />} />
                {/* we want to protect these routes */}
                <Route element={<RequireAuth />}>
                    <Route element={<Navbar />}>
                        <Route index element={<Choose socket={socket} />} />

                        <Route path="admin" element={<RequireGPerm allowedRoles={[process.env.REACT_APP_G_LIST_USERS]} />}>
                            <Route index element={<Admin />} />
                        </Route>
                        <Route path="userlist" element={<RequireGPerm allowedRoles={[process.env.REACT_APP_G_LIST_USERS]} />}>
                            <Route index element={<UserList socket={socket} />} />
                        </Route>
                        <Route path="/rest/:restId" element={<Restaurant socket={socket} />}>
                            <Route path="/rest/:restId/" element={<TableList socket={socket} />} />
                            <Route path="users" element={<RestUserList socket={socket} />} />
                            <Route path="settings" element={<RestSettings socket={socket} />} />
                        </Route>
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
    //<RouterProvider router={router} />;
}
