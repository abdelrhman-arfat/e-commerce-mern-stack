"use client";
import app from "@/app/utils/axios_setting";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSave = () => {
    if (newPassword.trim().length < 8 || oldPassword.trim().length < 8) return;
    toast.promise(
      app.patch("users/change-password", {
        oldPassword,
        newPassword,
      }),
      {
        loading: "Updating Password...",
        success: (response) => {
          return response.data.message || "Password updated successfully!";
        },
        error: (err) => {
          return err.response.data.message || "Failed to update password!";
        },
      }
    );
    setIsEditing(false);
    setOldPassword("");
    setNewPassword("");
  };

  return (
    <div className="flex flex-col gap-3 ">
      {isEditing ? (
        <div className="bg-white p-6 rounded-xl shadow-lg w-80">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Change Password
          </h2>
          <div className="flex flex-col gap-3">
            <input
              type="password"
              placeholder="Old Password"
              required
              min={8}
              max={16}
              className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              required
              min={8}
              max={16}
              placeholder="New Password"
              className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500 w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="flex justify-between mt-3">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition w-[48%]"
                onClick={handleSave}
                disabled={!oldPassword || !newPassword}
              >
                Save
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition w-[48%]"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          className="bg-seven text-white px-5 py-2 rounded-lg hover:bg-nine transition shadow-md"
          onClick={() => setIsEditing(true)}
        >
          Change Password
        </button>
      )}
    </div>
  );
};

export default ChangePassword;
