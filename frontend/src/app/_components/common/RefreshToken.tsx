"use client";
import { useEffect, useCallback } from "react";
import { login, logout } from "@/app/_RTK/redux-slices/authSlice";
import useAppDispatch from "@/app/hooks/AppDispatch";
import app from "@/app/utils/axios_setting";

const RefreshToken = () => {
  const dispatch = useAppDispatch();

  const handleRefreshToken = useCallback(async () => {
    try {
      const res = await app.get("/auth/refresh-token");
      const data = await res.data;
      if (res.status !== 200) {
        dispatch(logout());
        console.log(data);
        return;
      }
      dispatch(login(data.results));
    } catch (err) {
      console.error(err);
      dispatch(logout());
    }
  }, [dispatch]);

  useEffect(() => {
    handleRefreshToken();
    const intervalId = setInterval(() => {
      handleRefreshToken();
    }, 1000 * 60 * 15);
    return () => clearInterval(intervalId);
  }, [handleRefreshToken]);

  return null;
};

export default RefreshToken;
