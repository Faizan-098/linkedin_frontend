import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./src/redux/features/authSlice.js"
import userReducer from "./src/redux/features/userSlice.js"
import postReducer from "./src/redux/features/postSlice.js"
import profileReducer from "./src/redux/features/profile.js"
 const store = configureStore({
  reducer: {
    auth:authReducer,
    user:userReducer,
    post:postReducer,
    profile:profileReducer
  },
})

export default store;
