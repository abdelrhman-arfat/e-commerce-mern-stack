import { configureStore } from "@reduxjs/toolkit";
import { ecommerceAPI } from "../RTK-query/RTK_Query";

const app_store = configureStore({
  reducer: {
    [ecommerceAPI.reducerPath]: ecommerceAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat(ecommerceAPI.middleware),
});

export type RootState = ReturnType<typeof app_store.getState>;
export type AppDispatch = typeof app_store.dispatch;

export default app_store;
