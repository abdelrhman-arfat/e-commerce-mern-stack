"use client";
import { TUser } from "@/app/types/userTypes";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import UserSetting from "./UserSetting";

const UserCard = ({ user }: { user: TUser }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      {isOpen && <UserSetting setIsOpen={setIsOpen} user={user} />}
      {user.isAuthenticated ? (
        <div className="h-[50px] bg-gray-300 w-[50px] relative rounded-full overflow-hidden">
          {user.user?.profilePicture ? (
            <Image
              src={user?.user?.profilePicture}
              alt="User image"
              width={40}
              height={40}
              className="w-full h-full object-cover cursor-pointer rounded-full"
              priority
              unoptimized
              onClick={() => setIsOpen((prev) => !prev)}
            />
          ) : (
            <div
              className="w-full bg-six text-white flex items-center justify-center h-full cursor-pointer"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {(user.user?.fullname && user?.user?.fullname[0]) ||
                (user.user?.username && user?.user?.username[0])}
            </div>
          )}
        </div>
      ) : (
        <div>
          <Link
            className="px-5 py-1.5 rounded-md bg-ten hover:bg-nine text-white duration-300"
            href={"/login"}
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserCard;
