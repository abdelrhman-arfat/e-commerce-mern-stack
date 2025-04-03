import OneProductCard from "@/app/_components/cards/OneProductCard";
import CategoriesData from "@/app/_components/common/CategoriesData";
import Link from "next/link";
import React from "react";
interface PageProps {
  params: Promise<{ productId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { productId } = await params;

  return (
    <div className="flex flex-col items-center gap-5">
      <OneProductCard id={productId} />

      <CategoriesData />

      <Link
        href={"/shop/"}
        className="text-xl text-center w-[200px] px-3 py-2 hover:rounded-xl duration-200 bg-gray-100 hover:bg-gray-300 shadow-ms"
      >
        Back to Shop
      </Link>
    </div>
  );
};

export default Page;
