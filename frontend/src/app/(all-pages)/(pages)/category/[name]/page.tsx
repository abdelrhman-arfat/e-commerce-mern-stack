// app/(all-pages)/(pages)/category/[name]/page.tsx
import CategoriesData from "@/app/_components/common/CategoriesData";
import ProductCard from "@/app/_components/common/ProductCard";
import { TProduct } from "@/app/types/productType";
import axios from "axios";
import Link from "next/link";
import React from "react";

interface CategoryPageProps {
  params: { name: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { name } = params;

  const res = await axios.get(
    `http://localhost:3000/api/products/by-category?name=${name}`
  );

  const data = await res.data;

  if (!data.results.length) {
    return (
      <div className="w-full h-[80px]  text-center">
        <h1>No products found in this category. </h1>
        <Link
          className="inline-block py-2 hover:bg-sky-600 duration-200 mt-3 px-3 rounded-md bg-sky-400 text-white"
          href={"/shop"}
        >
          Continue Shopping
        </Link>
        <CategoriesData />
      </div>
    );
  }

  return (
    <div>
      <h1>Category: {name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {data.results.map((item: TProduct, i: number) => (
          <ProductCard item={item} key={i} />
        ))}
      </div>
      <CategoriesData />
    </div>
  );
}
