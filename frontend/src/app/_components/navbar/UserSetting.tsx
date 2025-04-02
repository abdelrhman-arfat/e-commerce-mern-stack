"use client";
import { TUser } from "@/app/types/userTypes";
import Link from "next/link";
import React, { SetStateAction } from "react";
import ChangeName from "./ChangeName";
import ChangePassword from "./ChangePassword";
import ChangeImage from "./ChangeImage";
import LogOut from "./LogOut";
import DeleteAccount from "./DeleteAccount";

const UserSetting = ({
  user,
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  user: TUser;
}) => {
  if (!user?.user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[13]">
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
            <p className="text-lg font-medium">{user.user?.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Username</p>
            <p className="text-lg font-medium">
              {user.user?.username || "N/A"}
            </p>
          </div>
          <div>
            <div>
              <p className="text-gray-600 text-sm ">Full Name</p>
              <p className="text-lg font-medium">
                {user.user?.fullname || "N/A"}
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
              <div className="flex gap-4 my-2">
                <Link
                  onClick={() => setIsOpen(false)}
                  href="/"
                  className="text-amber-900-50 text-sm hover:underline"
                >
                  🏠 Home
                </Link>
                <Link
                  onClick={() => setIsOpen(false)}
                  href="/cart"
                  className="text-blue-500 text-sm hover:underline"
                >
                  🛒 Cart
                </Link>
                <Link
                  onClick={() => setIsOpen(false)}
                  href="/my-orders"
                  className="text-green-700 text-sm hover:underline"
                >
                  📙 Orders
                </Link>
                <Link
                  onClick={() => setIsOpen(false)}
                  href="/fav"
                  className="text-yellow-500 text-sm hover:underline"
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
          className="absolute top-24 right-5  md:top-10  md:right-10 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition shadow-md"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>
        <LogOut />
        <DeleteAccount />
      </div>
    </div>
  );
};

export default UserSetting;
