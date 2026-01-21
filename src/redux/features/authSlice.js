import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  error: "",
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    setError: (state, { payload }) => {
      state.error = payload;
    },
  },
});
export const { setIsLoading, setError } = authSlice.actions;
export default authSlice.reducer;
