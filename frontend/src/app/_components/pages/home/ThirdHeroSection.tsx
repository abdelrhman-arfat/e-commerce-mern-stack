"use client";
import {
  useGetAllInCartQuery,
  useGetAllInFavQuery,
  useGetRandomProductsQuery,
} from "@/app/_RTK/RTK-query/RTK_Query";
import React from "react";
import ProductCardSkeleton from "../../cards/ProductCardSkeleton";
import ProductDiv from "../../common/ProductDiv";
import ProductCard from "../../cards/ProductCard";
import { TProduct } from "@/app/types/productType";

// some random products:
const ThirdHeroSection = () => {
  const {
    data: ProductData,
    isLoading: productIsLoading,
    isError: productIsError,
  } = useGetRandomProductsQuery();
  const { data: favDate, refetch: favRefetch } = useGetAllInFavQuery();
  const inFav =
    Array.isArray(favDate?.results) &&
    favDate?.results?.map((product: TProduct) => product.productId);

  const { data: cartData, refetch: cartRefetch } = useGetAllInCartQuery();
  
  const inCart = Array.isArray(cartData?.results)
    ? cartData.results.map((product) => {
        if (
          typeof product.productId === "object" &&
          product.productId !== null
        ) {
          return (product.productId as { _id: string })._id;
        }
        return product.productId;
      })
    : Array.isArray(cartData?.results?.products)
    ? cartData.results.products.map((product) => {
        if (
          typeof product.productId === "object" &&
          product.productId !== null
        ) {
          return (product.productId as { _id: string })._id;
        }
        return product.productId;
      })
    : [];

  if (productIsLoading) {
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

  if (productIsError) {
    return <p className="text-red-600">Error fetching products.</p>;
  }

  return (
    <section>
      {Array.isArray(ProductData?.results) && ProductData?.results?.length ? (
        <ProductDiv>
          {ProductData?.results?.map((item) => (
            <div key={item._id + "product-card"}>
              <ProductCard
                cartRefetch={cartRefetch}
                favRefetch={favRefetch}
                isInCart={inCart.includes(item._id)}
                isInFav={
                  (Array.isArray(inFav) && inFav?.includes(item._id)) || false
                }
                item={item}
              />
            </div>
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
