import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const initialState = {
  postModalState: false,
  userPosts: [],
  isLoading: false,
  error: "",
};

// upload user post
export const uploadUserPost = createAsyncThunk(
  "post/uploadUserPost",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        SERVER_URL + "/api/post/createPost",
        formData,
        {
          withCredentials: true,
        },
      );
      return res.data.post;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  },
);

// get user post
export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(SERVER_URL + "/api/post/getAllPosts", {
        withCredentials: true,
      });
      return res.data.posts;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  },
);

// userSlice
const userSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPostModalState: (state, { payload }) => {
      state.postModalState = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // create post
      .addCase(uploadUserPost.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(uploadUserPost.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.userPosts.unshift(payload);
      })

      .addCase(uploadUserPost.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // get user posts
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getAllPosts.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.userPosts = payload;
      })

      .addCase(getAllPosts.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export const { setPostModalState } = userSlice.actions;
export default userSlice.reducer;
