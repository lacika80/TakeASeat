import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Auth from "./components/Auth/Auth";
import Choose from "./components/Choose/Choose";
import Verify from "./components/Verify/Verify";

export default function App() {
    const user = JSON.parse(localStorage.getItem("profile"));
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<Home />}>
                <Route path="/auth" element={<Auth />} />
                <Route path="/verify" element={<Verify />} />
                <Route element={<Navbar />}>
                    <Route path="choose" element={<Choose />} />
                </Route>
            </Route>
        )
    );

    return <RouterProvider router={router} />;
}
