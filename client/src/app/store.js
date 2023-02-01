import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import linkReducer from "../features/linkSlice";
import userListReducer from "../features/userListSlice";
import restaurantsReducer from "../features/restaurantsSlice";
import tablesReducer from "../features/tablesSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        link: linkReducer,
        userList: userListReducer,
        restaurants: restaurantsReducer,
        tables: tablesReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }), //idk how to deal with the api response...
});
