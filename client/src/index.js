import React from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { store } from "./app/store";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { reducers } from "./reducers";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { createBrowserRouter, createRoutesFromElements, Link, Navigate, Outlet, RouterProvider, useLocation } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});
{
    /* <React.StrictMode>
    </React.StrictMode> */
}
root.render(
    <Provider store={store}>
        <ThemeProvider theme={darkTheme}>
            <BrowserRouter>
                   <App/>
            </BrowserRouter>
        </ThemeProvider>
    </Provider>
);
//reportWebVitals(console.log);
