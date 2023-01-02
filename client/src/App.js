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
import { useDispatch } from "react-redux";

import decode from "jwt-decode";
import NoUserGate from "./features/NoUserGate";
import UserList from "./components/Admin/UserList/UserList";
import RequireAuth from "./features/RequireAuth";

export default function App() {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        setSocket(io("http://localhost:5000"));
    }, []);
    /*useEffect(() => {
        if (!socket) return;
        socket.on("connect", () => {
            console.log(socket.id);
        });
        socket.on("test", (data) => {
            console.log(data);
        });
        socket.on("refresh-g-users", () => {
            console.log("ok, frissitem");
        });
        socket.emit("asd", { as: "ss" });
    }, [socket]); */

    const ROLES = {
        User: 1,
        Admin: 2,
    };
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="/" element={<NoUserGate />}>
                    {/* public routes */}
                    <Route path="Auth" element={<Auth />} />
                    <Route path="verify" element={<Verify />} />
                    <Route path="newpassword" element={<NewPassword />} />
                </Route>
                {/* we want to protect these routes */}
                <Route element={<RequireAuth />}>
                    <Route element={<Navbar />}>
                        <Route index element={<Choose />} />
                        <Route index element={<Restaurant />} />

                        <Route path="admin" element={<RequireGPerm allowedRoles={[ROLES.Admin]} />}>
                            <Route index element={<Admin />} />
                        </Route>
                        <Route path="userlist" element={<RequireGPerm allowedRoles={[process.env.REACT_APP_G_LIST_USERS]} />}>
                            <Route index element={<UserList socket={socket} />} />
                        </Route>
                    </Route>
                    {/* catch all */}
                </Route>
            </Route>
        </Routes>
    );
    //<RouterProvider router={router} />;
}
