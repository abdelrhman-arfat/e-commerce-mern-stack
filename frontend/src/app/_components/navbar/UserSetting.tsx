"use client";
import { TUser } from "@/app/types/userTypes";
import Link from "next/link";
import React, { SetStateAction } from "react";
import ChangeName from "./ChangeName";
import ChangePassword from "./ChangePassword";
import ChangeImage from "./ChangeImage";

const UserSetting = ({
  user,
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  user: TUser;
}) => {
  if (!user?.user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[3333333333]">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            User Settings
          </h2>
          <ChangeImage
            userImage={user.user.profilePicture as string}
            name={user.user.fullname as string}
          />
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-gray-600 text-sm">Email</p>
            <p className="text-lg font-medium">{user.user.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Username</p>
            <p className="text-lg font-medium">{user.user.username || "N/A"}</p>
          </div>
          <div>
            <div>
              <p className="text-gray-600 text-sm ">Full Name</p>
              <p className="text-lg font-medium">
                {user.user.fullname || "N/A"}
              </p>
              <ChangeName currentName={user.user.fullname as string} />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              {user.user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-red-500 font-medium hover:underline"
                >
                  Admin Panel
                </Link>
              )}
              <div className="flex gap-4">
                <Link href="/cart" className="text-blue-500 hover:underline">
                  🛒 Cart
                </Link>
                <Link
                  href="/favorites"
                  className="text-yellow-500 hover:underline"
                >
                  ⭐ Favorites
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="my-1">
          <ChangePassword />
        </div>
        <button
          className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserSetting;
