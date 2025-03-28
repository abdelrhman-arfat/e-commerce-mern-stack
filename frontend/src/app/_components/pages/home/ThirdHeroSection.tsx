"use client";
import { useGetRandomProductsQuery } from "@/app/_RTK/RTK-query/RTK_Query";
import React from "react";
import ProductCardSkeleton from "../../cards/ProductCardSkeleton";
import ProductDiv from "../../common/ProductDiv";
import ProductCard from "../../cards/ProductCard";

// some random products:
const ThirdHeroSection = () => {
  const { data, isLoading, isError } = useGetRandomProductsQuery();
  if (isLoading) {
    return (
      <ProductDiv>
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <ProductCardSkeleton key={index + "product-card-skeleton"} />
          ))}
      </ProductDiv>
    );
  }

  if (isError) {
    return <p className="text-red-600">Error fetching products.</p>;
  }

  return (
    <section>
      {data?.results?.length ? (
        <ProductDiv>
          {data?.results?.map((item) => (
            <ProductCard item={item} key={item._id + "product-card"} />
          ))}
        </ProductDiv>
      ) : (
        <div className="w-full text-xl bg-gray-200 shadow-sm py-3 text-center rounded-md">
          No Products found until now.
        </div>
      )}
    </section>
  );
};

export default ThirdHeroSection;
