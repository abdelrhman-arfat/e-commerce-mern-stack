"use client";
import { login } from "@/app/_RTK/redux-slices/authSlice";
import useAppDispatch from "@/app/hooks/AppDispatch";
import app from "@/app/utils/axios_setting";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ChangeName = ({ currentName }: { currentName: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(currentName);
  const dispatch = useAppDispatch();

  const handleSave = () => {
    if (newName.length < 5) {
      toast.error("Name must be at least 5 characters long.");
      return;
    }
    toast.promise(app.patch("/users/change-name", { newName }), {
      loading: "Updating name...",
      success: (response) => {
        dispatch(login(response.data.results));
        return response.data.message || "Name updated successfully!";
      },
      error: (err) => {
        return err.response.data.message || "Failed to update name.";
      },
    });
    setIsEditing(false);
  };

  return (
    <div className="flex pb-2 items-center gap-3 flex-wrap">
      {isEditing ? (
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-center">
          <input
            type="text"
            className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto max-w-xs"
            value={newName}
            required
            onChange={(e) => setNewName(e.target.value)}
          />
          <div className="flex w-full gap-2">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition w-full sm:w-auto"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition w-full sm:w-auto"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full sm:w-auto"
          onClick={() => setIsEditing(true)}
        >
          Change Name
        </button>
      )}
    </div>
  );
};

export default ChangeName;
