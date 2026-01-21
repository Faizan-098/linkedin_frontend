import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// server-url
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const initialState = {
  userData: null,
  notifications: [],
  editState: false,
  isLoading: false,
  error: "",
};

// Get Users
export const getCurrentUserData = createAsyncThunk(
  "user/getCurrentUserData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(SERVER_URL + "/api/user/currentUser", {
        withCredentials: true,
      });
      return res.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Update Users
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        SERVER_URL + "/api/user/updateProfile",
        profileData,
        {
          withCredentials: true,
        },
      );
      return res.data.user;
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// handle get notification request
export const getNotifications = createAsyncThunk(
  "user/getNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        SERVER_URL + "/api/notification/getNotification",
        {
          withCredentials: true,
        },
      );
      return res.data.notifications;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// userSlice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setEditState: (state, { payload }) => {
      state.editState = payload;
    },
    setUserData: (state, { payload }) => {
      console.log(payload);
      state.userData = payload;
    },
    setNotifications: (state, { payload }) => {
      state.notifications = payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // get current user
      .addCase(getCurrentUserData.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getCurrentUserData.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.userData = payload;
      })

      .addCase(getCurrentUserData.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(updateUserProfile.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.userData = payload;
      })

      .addCase(updateUserProfile.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })

      // Get notifications
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getNotifications.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.notifications = payload;
      })

      .addCase(getNotifications.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export const { setEditState, setUserData, setNotifications } =
  userSlice.actions;
export default userSlice.reducer;
