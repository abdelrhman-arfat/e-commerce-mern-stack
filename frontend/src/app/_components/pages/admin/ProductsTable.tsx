"use client";
import {
  useGetAllCategoriesQuery,
  useGetAllProductsQuery,
} from "@/app/_RTK/RTK-query/RTK_Query";
import Image from "next/image";
import React, { useState } from "react";
import AddProductModal from "./AddProductModal";
import Swal from "sweetalert2";
import app from "@/app/utils/axios_setting";
import toast from "react-hot-toast";
import { TProduct } from "@/app/types/productType";
import AddCategoryModal from "./AddCategoryModal";
import { TCategory } from "@/app/types/CategoryType";
import ChangeProduct from "../../btns/ChangeProduct";
import Loader from "../../lodingAndErrors/Loader";
import Error from "../../lodingAndErrors/Error";
import useUserSelector from "@/app/hooks/AppSelector";
import Link from "next/link";
import DeleteCategory from "../../btns/DeleteCategory";
import Refresh from "../../btns/Refresh";

const ProductsTable = () => {
  const me = useUserSelector();

  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useGetAllProductsQuery({
    page,
  });

  const { data: categoryData, refetch: categoryRefetch } =
    useGetAllCategoriesQuery();

  if (me.user?.role === "USER") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h1 className="text-4xl font-bold text-red-500">Access Denied</h1>
          <p className="text-gray-600 mt-2">
            You do not have permission to view this page.
          </p>

          <div className="mt-4">
            <Link href="/">
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
                Go to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error />;
  }
  return (
    <>
      <div className="w-full flex gap-3 items-center justify-center">
        <AddProductModal
          categories={categoryData?.results as TCategory[]}
          refetch={refetch}
        />
        <AddCategoryModal refetch={categoryRefetch} />
        <DeleteCategory data={categoryData} refetch={categoryRefetch} />
      </div>
      <Refresh refetch={refetch} />

      <div className="flex p-4 justify-between items-center">
        <button
          disabled={page === 1}
          className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 
            ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => setPage((prevPage) => Math.max(1, prevPage - 1))}
        >
          Prev
        </button>
        <button
          disabled={page === data?.totalPages}
          className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 
            ${
              page === data?.totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          onClick={() =>
            setPage((prevPage) =>
              prevPage === data?.totalPages ? prevPage : prevPage + 1
            )
          }
        >
          Next
        </button>
      </div>

      <div className="p-4">
        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-300">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left text-sm font-semibold">Image</th>
                <th className="p-3 text-left text-sm font-semibold">Name</th>
                <th className="p-3 text-left text-sm font-semibold">Price</th>
                <th className="p-3 text-left text-sm font-semibold">
                  Category
                </th>
                <th className="p-3 text-right pr-20 text-sm font-semibold w-[150px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data?.results) &&
                data?.results?.map((product: TProduct) => (
                  <tr
                    key={product._id}
                    className="border-b text-sm transition duration-200 hover:bg-gray-50"
                  >
                    <td className="p-3">
                      <Image
                        src={product.image || "/placeholder.png"}
                        alt={product.title}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-md object-cover border border-gray-300"
                        priority
                      />
                    </td>
                    <td className="p-3">{product.title}</td>
                    <td className="p-3">${product.price}</td>
                    <td className="p-3">{product.category}</td>

                    <td className="p-3 text-right">
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => {
                            Swal.fire({
                              title: "Are you sure?",
                              text: "You won't be able to revert this!",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              cancelButtonColor: "#d33",
                              confirmButtonText: "Yes, delete it!",
                            }).then(async (result) => {
                              if (result.isConfirmed) {
                                toast.promise(
                                  app.delete(
                                    `/admin/delete-product/${product._id}`
                                  ),
                                  {
                                    loading: "Deleting...",

                                    success: (response) => {
                                      if (response.status === 200) {
                                        refetch();
                                        return (
                                          response.data.message ||
                                          "Success deleting product"
                                        );
                                      } else {
                                        toast.error("Failed to delete product");
                                      }
                                    },
                                    error: (err) => {
                                      return (
                                        err.response?.data?.message ||
                                        "Failed to create product"
                                      );
                                    },
                                  }
                                );
                              }
                            });
                          }}
                          className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600 transition duration-200 shadow-md"
                        >
                          Delete
                        </button>
                        <ChangeProduct
                          categories={categoryData?.results as TCategory[]}
                          refetch={refetch}
                          product={product}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProductsTable;
