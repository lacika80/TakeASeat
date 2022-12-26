import React, { useEffect, useState } from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Auth from "./components/Auth/Auth";
import Choose from "./components/Choose/Choose";
import Verify from "./components/Verify/Verify";
import NewPassword from "./components/NewPassword/NewPassword";
import Restaurant from "./components/Restaurant/Restaurant";

import { io } from "socket.io-client";

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

    const user = JSON.parse(localStorage.getItem("profile"));
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<Home />}>
                <Route path="/auth" element={<Auth />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/newpassword" element={<NewPassword />} />
                <Route element={<Navbar />}>
                    <Route path="choose" element={<Choose />} />
                    <Route path="rest" element={<Restaurant />} />
                </Route>
            </Route>
        )
    );

    return <RouterProvider router={router} />;
}
