"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const LinksOfNavbar = ({ label, href }: { label: string; href: string }) => {
  const path = usePathname();
  const isActive = path === href;
  return (
    <li>
      <Link
        className={`${
          isActive && "border-five border-b-2 "
        } px-3 py-1.5 hover:rounded-md hover:border-b-0 hover:bg-seven hover:text-white duration-300`}
        href={href}
      >
        {label}
      </Link>
    </li>
  );
};

export default LinksOfNavbar;
