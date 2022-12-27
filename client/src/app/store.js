import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import linkReducer from '../features/linkSlice'
export const store = configureStore({
  reducer:{
    auth: authReducer,
    link: linkReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
})