import { configureStore } from "@reduxjs/toolkit";
import { ecommerceAPI } from "../RTK-query/RTK_Query";
import { persistReduced } from "../redux-persist/PersistSetting";
import { persistStore } from "redux-persist";

const FLUSH: string = "persist/FLUSH";
const REHYDRATE: string = "persist/REHYDRATE";
const PAUSE: string = "persist/PAUSE";
const PERSIST: string = "persist/PERSIST";
const PURGE: string = "persist/PURGE";
const REGISTER: string = "persist/REGISTER";

const app_store = configureStore({
  reducer: persistReduced,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).concat(ecommerceAPI.middleware as any),
  devTools: process.env.NODE_ENV === "development",
});

export type RootState = ReturnType<typeof app_store.getState>;
export type AppDispatch = typeof app_store.dispatch;
export const persistor = persistStore(app_store);

export default app_store;
