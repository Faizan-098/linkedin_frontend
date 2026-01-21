import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../frontend/src/redux/features/authSlice.js"
import userReducer from "../frontend/src/redux/features/userSlice.js"
import postReducer from "../frontend/src/redux/features/postSlice.js"
import profileReducer from "../frontend/src/redux/features/profile.js"
 const store = configureStore({
  reducer: {
    auth:authReducer,
    user:userReducer,
    post:postReducer,
    profile:profileReducer
  },
})

export default store;
