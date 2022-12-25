import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/userSlice'
import linkReducer from '../features/linkSlice'
export const store = configureStore({
  reducer:{
    user: userReducer,
    link: linkReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
})