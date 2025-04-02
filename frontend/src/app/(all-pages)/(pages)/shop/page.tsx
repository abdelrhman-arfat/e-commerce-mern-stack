"use client";
import ProductCard from "@/app/_components/cards/ProductCard";
import ProductCardSkeleton from "@/app/_components/cards/ProductCardSkeleton";
import ProductDiv from "@/app/_components/common/ProductDiv";
import {
  useGetAllInCartQuery,
  useGetAllInFavQuery,
  useGetAllProductsQuery,
} from "@/app/_RTK/RTK-query/RTK_Query";
import { TProduct } from "@/app/types/productType";
import React, { useState } from "react";
const Page = () => {
  const [page, setPage] = useState<number>(1);

  const {
    data: ProductData,
    isLoading: productIsLoading,
    isError: productIsError,
  } = useGetAllProductsQuery({
    page,
  });
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
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
      </div>

      <div className="flex p-4 justify-between items-center">
        <button
          disabled={page === 1}
          className={`px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-500 
    ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => setPage((prevPage) => Math.max(1, prevPage - 1))}
        >
          Prev
        </button>

        <button
          disabled={page === ProductData?.totalPages}
          className={`px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-500 
    ${page === ProductData?.totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() =>
            setPage((prevPage) =>
              prevPage === ProductData?.totalPages ? prevPage : prevPage + 1
            )
          }
        >
          Next
        </button>
      </div>

      <section>
        {Array.isArray(ProductData?.results) ? (
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
    </div>
  );
};

export default Page;
