"use client";
import { useGetAllInCartQuery } from "@/app/_RTK/RTK-query/RTK_Query";
import React from "react";
import { TProduct } from "@/app/types/productType";

const CartItem = ({ product }: { product: TProduct }) => {
  const productDetails =
    typeof product.productId === "object" ? product.productId : null;

  if (!productDetails || !productDetails._id) return null;

  return (
    <div className="border p-4 rounded-lg flex justify-between items-center">
      <div>
        <h3 className="font-bold">
          {productDetails.title || "Unknown Product"}
        </h3>
        <p className="text-gray-500">${productDetails.price ?? "N/A"}</p>
        <p className="text-gray-400">Quantity: {product.quantity ?? 1}</p>
      </div>
    </div>
  );
};

const CartPage = () => {
  const { data } = useGetAllInCartQuery();

  const products = Array.isArray(data?.results)
    ? data.results
    : Array.isArray(data?.results?.products)
    ? data.results.products
    : [];

  return (
    <div className="space-y-4">
      {products.map((product: TProduct) =>
        typeof product.productId === "object" && product.productId ? (
          <CartItem key={product._id} product={product} />
        ) : null
      )}
    </div>
  );
};

export default CartPage;
