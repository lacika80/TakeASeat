import React, { useEffect, useState } from "react";
import { createBrowserRouter, createRoutesFromElements, Route, Routes, RouterProvider } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";

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
import { loginWithToken } from "./features/authSlice";
import { useDispatch } from "react-redux";

import decode from "jwt-decode";

export default function App() {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        setSocket(io("http://localhost:5000"));
    }, []);
    useEffect(() => {
        if (!socket) return;
        socket.on("connect", () => {
            console.log(socket.id);
        });
        socket.on("test", (data) => {
            console.log(data);
        });
        socket.emit("asd", { as: "ss" });
    }, [socket]);

    const ROLES = {
        User: 1,
        Admin: 2,
    };
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* public routes */}
                <Route path="Auth" element={<Auth />} />
                <Route path="verify" element={<Verify />} />
                <Route path="newpassword" element={<NewPassword />} />
                {/* we want to protect these routes */}
                <Route element={<Navbar />}>
                    <Route path="/" element={<RequireAuth allowedRoles={[ROLES.User]} />}>
                        <Route index element={<Choose />} />
                    </Route>

                    <Route path="admin" element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                        <Route index element={<Admin />} />
                    </Route>

                    <Route path="rest" element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}>
                        <Route index element={<Restaurant />} />
                    </Route>
                </Route>
                {/* catch all */}
            </Route>
        </Routes>
    );
    //<RouterProvider router={router} />;
}
