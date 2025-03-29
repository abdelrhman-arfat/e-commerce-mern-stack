"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const AdminNavBar = () => {
  const pathname = usePathname();

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
    <header className="w-full h-[60px] mt-3 ">
      <nav className="mx-auto px-10 w-[94%] sm:w-[60%] shadow-sm rounded-full bg-gray-100 h-full flex gap-6 sm:gap-3 md:gap-0 items-center justify-evenly ">
        {links.map((link, index) => (
          <Link
            className={` ${
              pathname === link.href && "border-b-2 border-four"
            } tracking-wider border-b-2  hover:border-four  duration-300`}
            href={link.href}
            key={link.name + "admin-links-" + index}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default AdminNavBar;
