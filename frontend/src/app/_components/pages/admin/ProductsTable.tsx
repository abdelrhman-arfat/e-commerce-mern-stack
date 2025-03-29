"use client";
import { useGetAllProductsQuery } from "@/app/_RTK/RTK-query/RTK_Query";
import Image from "next/image";
import React, { useState } from "react";
import AddProductModal from "./AddProductModal";
import Swal from "sweetalert2";
import app from "@/app/utils/axios_setting";
import toast from "react-hot-toast";

const ProductsTable = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useGetAllProductsQuery({
    page,
  });

  if (isLoading) return <p className="text-center text-lg">Loading...</p>;
  if (isError)
    return (
      <p className="text-center text-lg text-red-600">
        Error fetching products
      </p>
    );

  return (
    <>
      <div className="w-full text-center">
        <AddProductModal refetch={refetch} />
      </div>
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
                <th className="p-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.results?.map((product) => (
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

                  <td className="p-3">
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
