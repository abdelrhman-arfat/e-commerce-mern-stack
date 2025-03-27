import { persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";

import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../redux-slices/authSlice";
import { ecommerceAPI } from "../RTK-query/RTK_Query";

const persistConfig = {
  key: "root",
  storage: storageSession,
  whitelist: ["auth"],
};

const allReducers = combineReducers({
  auth: authSlice,
  [ecommerceAPI.reducerPath]: ecommerceAPI.reducer,
});

const persistReduced = persistReducer(persistConfig, allReducers);

export { persistReduced };
