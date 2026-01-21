import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const initialState = {
  profileData: {},
  isLoading: false,
  error: "",
};

// get profile data
export const getProfileData = createAsyncThunk(
  "profile/getProfileData",
  async (userName,{rejectWithValue}) =>{
    try {
      const res = await axios.get(SERVER_URL+`/api/user/getUserProfile/${userName}`,{
        withCredentials:true
      })
    //   console.log(res.data.user);
      return res.data.user;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message)
    }
  }
)

// profileSlice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
  }, 
  extraReducers: (builder) => {
      builder
        // get user posts
        .addCase(getProfileData.pending, (state) => {
          state.isLoading = true;
        })
  
        .addCase(getProfileData.fulfilled, (state, {payload}) => {
          state.isLoading = false;
          state.profileData=payload;
        })
  
        .addCase(getProfileData.rejected, (state, {payload}) => {
          state.isLoading = false;
          state.error = payload;
        })

    },

});

export default profileSlice.reducer;