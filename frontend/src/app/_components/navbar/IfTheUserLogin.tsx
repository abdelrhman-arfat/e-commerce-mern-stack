"use client";
import useUserSelector from "@/app/hooks/AppSelector";
import Image from "next/image";
import Link from "next/link";
import React from "react";
const IfTheUserLogin = () => {
  const user = useUserSelector();

  return (
    <div>
      {user.isAuthenticated ? (
        <div className="h-[40px] w-[40px] relative rounded-full overflow-hidden">
          {user.user?.profilePicture ? (
            <Image
              src={user.user?.profilePicture}
              alt={user.user.fullname + "image"}
              fill
              sizes="100%"
              style={{
                objectFit: "cover",
              }}
            ></Image>
          ) : (
            <div className="w-full bg-six text-white flex items-center justify-center h-full">
              {(user.user?.fullname && user?.user?.fullname[0]) ||
                (user.user?.username && user?.user?.username[0])}
            </div>
          )}
        </div>
      ) : (
        <li>
          <Link
            className="px-5 py-1.5 rounded-md bg-ten hover:bg-nine text-white duration-300"
            href={"/login"}
          >
            Login
          </Link>
        </li>
      )}
    </div>
  );
};

export default IfTheUserLogin;
