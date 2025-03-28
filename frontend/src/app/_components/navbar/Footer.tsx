import Link from "next/link";
import React from "react";
import { BsGithub } from "react-icons/bs";

const Footer = () => {
  return (
    <div className="w-full rounded-xl  shadow-sm py-5 flex items-center justify-center flex-col gap-4 bg-gray-200">
      <p className="text-center text-gray-700 text-sm">
        Copyright ©{" "}
        <span className="font-bold">{new Date().getFullYear()} </span> Your
        Website. All rights reserved.
      </p>
      <div className="">
        <Link
          className="text-[16px] hover:scale-105 flex items-center justify-center gap-4 duration-300"
          target="_blank"
          href={"https://github.com/abdelrhman-arfat/e-commerce-mern-stack"}
        >
          <BsGithub />
          Repo
        </Link>
      </div>
    </div>
  );
};

export default Footer;
