"use client";
import useUserSelector from "@/app/hooks/AppSelector";
import Link from "next/link";
import React from "react";
const IfTheUserLogin = () => {
  const user = useUserSelector();

  return (
    <div>
      {user.isAuthenticated ? (
        <div>user</div>
      ) : (
        <li>
          <Link 
          className="px-5 py-1.5 rounded-md bg-ten hover:bg-nine text-white duration-300"
          href={"/login"}>Login</Link>
        </li>
      )}
    </div>
  );
};

export default IfTheUserLogin;
