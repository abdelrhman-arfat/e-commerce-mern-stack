import { TProduct } from "@/app/types/productType";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({ item }: { item: TProduct }) => {
  return (
    <div className="bg-gray-500 animate-pulse rounded-md w-full group ">
      <div className="group-hover:flex none">ddd</div>
      <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg ">
        <div className="relative h-44 m-2.5 overflow-hidden text-white rounded-md">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="100%"
            className="rounded-md duration-300 hover:scale-[1.5]"
            style={{
              objectFit: "cover",
            }}
          ></Image>
        </div>
        <div className="p-4">
          <div className="mb-4 rounded-full bg-cyan-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-20 text-center">
            {item.price}
          </div>
          <h6 className="mb-2 text-slate-800 text-xl font-semibold">
            {item.title}
          </h6>
          <p className="text-slate-600 line-clamp-2  font-light">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between py-1 px-4"></div>
        <div className="w-full text-center">
          <Link
            className="px-2 py-1 my-2 bg-four text-white w-[90%] rounded-xl inline-block"
            href="/products/by-id/_id"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
