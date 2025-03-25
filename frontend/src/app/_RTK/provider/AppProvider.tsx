"use client";
import React from "react";
import app_store from "../redux-store/Redux_store";
import { Provider } from "react-redux";
const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={app_store}>{children}</Provider>;
};

export default AppProvider;
