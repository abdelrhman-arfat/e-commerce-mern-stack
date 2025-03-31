"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import UserCard from "./UserCard";
import useUserSelector from "@/app/hooks/AppSelector";

const AdminNavBar = () => {
  const pathname = usePathname();
  const user = useUserSelector();

  const links = [
    {
      name: "Orders",
      href: "/admin",
    },
    {
      name: "Products",
      href: "/admin/products",
    },
    {
      name: "Users",
      href: "/admin/users",
    },
  ];
  return (
    <header className="w-full mt-3 ">
      <nav className="mx-auto px-10 w-[94%] sm:w-[60%] shadow-sm rounded-full bg-gray-100 min-h-[100px]  flex flex-col sm:flex-row gap-6 sm:gap-3 md:gap-0 items-center justify-evenly ">
        <div className="mx-auto px-10 w-full flex-1 rounded-full  h-full flex  gap-6 sm:gap-3 md:gap-0 items-center justify-evenly ">
          {links.map((link, index) => (
            <Link
              className={` ${
                pathname === link.href && " border-four"
              } tracking-wider border-b-2  hover:border-four  duration-300`}
              href={link.href}
              key={link.name + "admin-links-" + index}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="">
          <UserCard user={user} />
        </div>
      </nav>
    </header>
  );
};

export default AdminNavBar;
