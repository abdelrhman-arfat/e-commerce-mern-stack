import Image from "next/image";
import Link from "next/link";
import React from "react";

const HomeHero = () => {
  return (
    <section className="flex items-center">
      <div className="relative w-full h-[540px]">
        <div className="w-full flex flex-col gap-4 items-center justify-center h-full top-0 left-0 absolute z-10">
          <h1 className="rounded-md text-[18px] sm:text-2xl md:text-4xl xl:text-5xl text-center bg-white/80 text-ten uppercase px-3 py-3 font-bold">
            Welcome to our e-commerce platform!
          </h1>
          <Link
            href={"/products"}
            className="bg-gradient-to-r from-four to-seven text-white px-2 py-1 rounded-md hover:tracking-[2px] duration-300"
          >
            Shop Now
          </Link>
        </div>
        <Image
          priority
          src={"/mainImage.jpg"}
          alt="Yes babe"
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          fill
          sizes="100%"
          className="rounded-xl shadow-md"
        ></Image>
      </div>
    </section>
  );
};

export default HomeHero;
