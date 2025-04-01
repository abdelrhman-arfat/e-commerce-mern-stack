"use client";

import React from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import app from "@/app/utils/axios_setting";
import { useRouter } from "next/navigation";
import useAppDispatch from "@/app/hooks/AppDispatch";
import { logout } from "@/app/_RTK/redux-slices/authSlice";

const LogOut = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Log Out",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      toast.promise(app.post("/auth/logout"), {
        loading: "Logging out...",
        success: () => {
          dispatch(logout());
          router.push("/");
          return "Successfully logged out!";
        },
        error: "Logout failed. Please try again!",
      });
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-gray-500 w-full inline-block my-2 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300"
    >
      Log Out
    </button>
  );
};

export default LogOut;
