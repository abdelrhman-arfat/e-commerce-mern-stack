"use client";
import CategoriesData from "@/app/_components/common/CategoriesData";
import ProductCard from "@/app/_components/cards/ProductCard";
import { TProduct, TProducts } from "@/app/types/productType";
import React, { useEffect, useState } from "react";
import app from "@/app/utils/axios_setting";
import {
  useGetAllInCartQuery,
  useGetAllInFavQuery,
} from "@/app/_RTK/RTK-query/RTK_Query";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const name = params?.name;
  const [data, setData] = useState<TProducts>();
  useEffect(() => {
    const fetchData = async () => {
      const res = await app.get(`/products/by-category/${name}`);
      const data = await res.data;
      setData(data);
    };
    fetchData();
  }, [name]);
  const { data: favDate, refetch: favRefetch } = useGetAllInFavQuery();
  const inFav =
    Array.isArray(favDate?.results) &&
    favDate?.results?.map((product: TProduct) => product.productId);

  const { data: cartData, refetch: cartRefetch } = useGetAllInCartQuery();

  const inCart = Array.isArray(cartData?.results)
    ? cartData?.results.map((product: TProduct) => product.productId)
    : Array.isArray(cartData?.results?.products)
    ? cartData?.results?.products.map((product) => product?.productId)
    : [];
  return (
    <div>
      <CategoriesData />
      <h1 className="text-xl my-2">Category: {name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {Array.isArray(data?.results) &&
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
          ))}
      </div>
    </div>
  );
};
export default Page;
