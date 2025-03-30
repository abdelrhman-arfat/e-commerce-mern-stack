import { TCategory } from "@/app/types/CategoryType";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CategoryCard = ({ item }: { item: TCategory }) => {
  const { name, image } = item;
  return (
    <Link
      href={`/category/${name}`}
      className="flex items-center flex-col gap-4 "
    >
      <div className="relative w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] flex justify-center items-center  rounded-full bg-[#eeeeee] shadow-sm ">
        <Image
          priority
          src={image}
          alt={name}
          fill
          sizes="100%"
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          className="rounded-full"
        ></Image>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-700">{name}</h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
