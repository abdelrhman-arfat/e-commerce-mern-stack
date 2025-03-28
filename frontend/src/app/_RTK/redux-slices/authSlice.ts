import { TUser } from "@/app/types/userTypes";
import { createSlice } from "@reduxjs/toolkit";

const initialState: TUser = {
  isAuthenticated: false,
  user: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = {};
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
