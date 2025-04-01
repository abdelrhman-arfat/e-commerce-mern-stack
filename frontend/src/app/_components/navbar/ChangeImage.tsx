"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaPen } from "react-icons/fa";
import toast from "react-hot-toast";
import app from "@/app/utils/axios_setting";
import { login } from "@/app/_RTK/redux-slices/authSlice";
import useAppDispatch from "@/app/hooks/AppDispatch";
import { BsCamera } from "react-icons/bs";

const ChangeImage = ({
  userImage,
  name,
}: {
  userImage: string;
  name: string;
}) => {
  const [preview, setPreview] = useState<string>(userImage);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    toast.promise(
      app.patch("/users/change-profilePicture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      {
        loading: "Changing profile image...",
        success: (response) => {
          dispatch(login(response.data.results));
          return response.data.message || "profile image updated successfully!";
        },
        error: (err) => {
          return err.response.data.message || "Failed to update profile image.";
        },
      }
    );
    setIsOpen(false); // Close modal after submission
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <button
        onClick={() => setIsOpen(true)}
        className="relative w-24 h-24 rounded-full overflow-hidden border flex items-center justify-center group"
      >
        {preview ? (
          <Image
            src={preview}
            alt={name + "image-in-change-image"}
            fill
            sizes="100%"
            priority
            style={{
              objectFit: "cover",
            }}
          />
        ) : (
          <span className="text-2xl font-semibold text-gray-700">
            {userImage !== "" ? (
              <Image
                src={userImage}
                alt={name}
                fill
                sizes="100%"
                priority
                style={{
                  objectFit: "cover",
                }}
              />
            ) : (
              name?.charAt(0)?.toUpperCase() || <BsCamera />
            )}
          </span>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <FaPen className="text-white" />
        </div>
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white flex flex-col items-center gap-4 p-6 border rounded-lg shadow-xl w-96"
          >
            <h2 className="text-xl font-semibold">Change Profile Image</h2>
            <div className="relative w-24 h-24 rounded-full overflow-hidden border">
              <Image
                priority
                src={preview}
                alt={name}
                fill
                sizes="100%"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="border p-2 rounded-lg w-full"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChangeImage;
