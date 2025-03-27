"use client";
import React from "react";
import app_store, { persistor } from "../redux-store/Redux_store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={app_store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  );
};

export default AppProvider;
