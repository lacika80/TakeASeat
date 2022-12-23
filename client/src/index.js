import React from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { store } from "./app/store";
import reportWebVitals from "./reportWebVitals";

import { reducers } from "./reducers";
import App from "./App";
import { createBrowserRouter, createRoutesFromElements, Link, Navigate, Outlet, Route, RouterProvider, useLocation } from "react-router-dom";




const root = ReactDOM.createRoot(document.getElementById("root"));



root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);
//reportWebVitals(console.log);
