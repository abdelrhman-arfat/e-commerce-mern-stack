"use client";
import CategoriesData from "@/app/_components/common/CategoriesData";
import ProductCard from "@/app/_components/cards/ProductCard";
import { TProduct } from "@/app/types/productType";
import {
  useGetAllInCartQuery,
  useGetAllInFavQuery,
  useGetProductByCategoryQuery,
} from "@/app/_RTK/RTK-query/RTK_Query";
import { useParams } from "next/navigation";
import Refresh from "@/app/_components/btns/Refresh";

const Page = () => {
  const params = useParams();
  const name = params?.name;
  const { data, refetch } = useGetProductByCategoryQuery(name as string);
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

  return (
    <div>
      <CategoriesData />
      <h1 className="text-xl my-2">Category: {name}</h1>
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {Array.isArray(data?.results) && data.results.length > 0 ? (
          data?.results?.map((item: TProduct, i: number) => (
            <ProductCard
              key={item._id + i + "in-get-by-category"}
              cartRefetch={cartRefetch}
              isInCart={inCart?.includes(item._id) || false}
              favRefetch={favRefetch}
              isInFav={
                (Array.isArray(inFav) && inFav?.includes(item._id)) || false
              }
              item={item}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center bg-gray-100 rounded-xl p-6 shadow-md animate-fade-in">
            <svg
              className="w-16 h-16 text-gray-400 mb-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h11M9 21V3m0 0l-3 3m3-3l3 3"
              />
            </svg>
            <h2 className="text-lg font-semibold text-gray-700">
              No products found in this category.
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Try exploring other categories!
            </p>
            <Refresh refetch={refetch} />
          </div>
        )}
      </div>
    </div>
  );
};
export default Page;
