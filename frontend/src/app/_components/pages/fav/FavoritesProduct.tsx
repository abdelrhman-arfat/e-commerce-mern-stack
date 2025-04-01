"use client";
import { useGetAllInFavToPageQuery } from "@/app/_RTK/RTK-query/RTK_Query";
import React from "react";
import Image from "next/image";
import AddToFav from "../../btns/AddToFav";
import Link from "next/link";

const FavoritesProduct = () => {
  const { data, refetch } = useGetAllInFavToPageQuery();

  if (!Array.isArray(data?.results)) {
    return (
      <div className="text-center text-xl font-semibold mt-10">
        No favorite products found.
      </div>
    );
  }

  if (data?.results.length === 0) {
    return (
      <div className="text-center text-xl font-semibold mt-10">
        No favorite products found.
      </div>
    );
  }

  return (
    <div className="space-y-6 px-8 py-8 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">
        Your Favorite Products
      </h1>
      <div className="space-y-4">
        {data?.results?.map(
          (fav) =>
            typeof fav.productId === "object" &&
            fav.productId && (
              <div
                key={fav._id}
                className="border rounded-lg p-4 shadow-lg flex flex-col sm:flex-row items-center w-full bg-white"
              >
                <div className="w-full">
                  <AddToFav
                    isInFav={true}
                    _id={fav.productId._id}
                    refetch={refetch}
                  />
                </div>
                <div className="w-full sm:w-1/3 flex justify-center mb-4 sm:mb-0">
                  <Image
                    src={fav.productId.image}
                    alt={fav.productId.title}
                    width={150}
                    height={150}
                    className="object-cover rounded"
                  />
                </div>

                <div className="w-full sm:w-2/3 flex flex-col justify-between px-4">
                  <h3 className="text-xl font-semibold">
                    {fav.productId.title}
                  </h3>
                  <p className="text-gray-600 mt-2">${fav.productId.price}</p>
                  <p className="text-gray-400 mt-1">{fav.productId.category}</p>
                </div>
                <div className="w-full text-center">
                  <Link
                    href={`/by-id/${fav.productId._id}`}
                    className="inline-block w-full py-2 rounded-xl bg-gray-300 hover:bg-neutral-500 hover:text-white duration-300 "
                  >
                    Buy now
                  </Link>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default FavoritesProduct;
