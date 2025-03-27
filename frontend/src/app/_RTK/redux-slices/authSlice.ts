import { TUser } from "@/app/types/userTypes";
import { createSlice } from "@reduxjs/toolkit";

const initialState: TUser = {};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state = action.payload;
    },
    logout: (state) => {
      state = {};
      return state;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice;
