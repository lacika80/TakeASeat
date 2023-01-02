import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import linkReducer from '../features/linkSlice'
import userListReducer from '../features/userListSlice'
export const store = configureStore({
  reducer:{
    auth: authReducer,
    link: linkReducer,
    userList: userListReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
})