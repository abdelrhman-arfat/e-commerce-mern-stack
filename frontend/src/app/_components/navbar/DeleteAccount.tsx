"use client";
import React from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import app from "@/app/utils/axios_setting";
import { logout } from "@/app/_RTK/redux-slices/authSlice";
import useAppDispatch from "@/app/hooks/AppDispatch";

const DeleteAccount = () => {
  const dispatch = useAppDispatch();
  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action is irreversible! Your account will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      toast.promise(
        app.delete("/users/delete"), // Change this to your correct API endpoint
        {
          loading: "Deleting your account...",
          success: (res) => {
            dispatch(logout());
            return (
              res.data.message || "Your account has been deleted successfully!"
            );
          },
          error: "Failed to delete account. Please try again.",
        }
      );
    }
  };

  return (
    <button
      onClick={handleDeleteAccount}
      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
    >
      Delete My Account
    </button>
  );
};

export default DeleteAccount;
