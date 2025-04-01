import OneProductCard from "@/app/_components/cards/OneProductCard";
import React from "react";
interface PageProps {
  params: Promise<{ productId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { productId } = await params;

  return (
    <div>
      <OneProductCard id={productId} />
    </div>
  );
};

export default Page;
