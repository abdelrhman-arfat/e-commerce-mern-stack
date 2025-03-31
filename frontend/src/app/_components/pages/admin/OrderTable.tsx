"use client";
import { useGetAllOrdersQuery } from "@/app/_RTK/RTK-query/RTK_Query";
import Swal from "sweetalert2";
import React, { useState } from "react";
import app from "@/app/utils/axios_setting";
import toast from "react-hot-toast";
import Image from "next/image";
import Loader from "../../lodingAndErrors/Loader";
import Error from "../../lodingAndErrors/Error";

const OrderTable = () => {
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError, refetch } = useGetAllOrdersQuery({ page });
  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
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
          disabled={page === data?.totalPages}
          className={`px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-500 
    ${page === data?.totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
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
                <th className="p-3 text-left text-sm font-semibold">
                  Order ID
                </th>
                <th className="py-3 px-1 text-left text-sm font-semibold">
                  Customer
                </th>
                <th className="py-3 px-1 text-left text-sm font-semibold">
                  Product Image
                </th>
                <th className="py-3 px-1 text-left text-sm font-semibold">
                  Total Price
                </th>
                <th className="py-3 px-1 text-left text-sm font-semibold">
                  Count
                </th>
                <th className="py-3 px-1 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="py-3 w-[100px] px-1 flex justify-end text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data?.results) &&
                data.results.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b text-sm transition duration-200 hover:bg-gray-50"
                  >
                    <td className="p-3">{order._id}</td>
                    <td className="py-3 px-1">
                      {typeof order?.userId === "object" &&
                        order?.userId?.fullname}
                    </td>
                    <td className="py-3 px-1">
                      {typeof order.productId === "object" &&
                      order?.productId?.image ? (
                        <div className="relative w-14 h-14">
                          <Image
                            src={order.productId?.image}
                            alt="Product"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md border"
                          />
                        </div>
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="py-3 px-1">
                      {typeof order?.productId === "object" &&
                      order?.productId?.price !== undefined &&
                      order.quantity !== undefined
                        ? `$${(
                            +order.productId.price * +order?.quantity
                          ).toFixed(2)}`
                        : ""}
                    </td>
                    <td className="py-3 px-1">{order?.quantity}</td>
                    <td
                      className="py-3 px-1 text-[12px] font-semibold"
                      style={{ color: order.isDone ? "green" : "red" }}
                    >
                      {order.isDone ? "Completed" : "Pending"}
                    </td>
                    <td className="py-3  px-1 ">
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
                              const res = await app.delete(
                                `/orders/delete-order/${order._id}`
                              );
                              if (res.status !== 200) {
                                toast.error(
                                  res.data.message || "Failed to delete order."
                                );
                                return;
                              }
                              toast.success(
                                res.data.message || "Order deleted successfully"
                              );
                              refetch();
                            }
                          });
                        }}
                        className="rounded bg-red-500 mx-1 px-3 py-1 text-white hover:bg-red-600 transition duration-200 shadow-md"
                      >
                        Delete
                      </button>

                      {!order.isDone && (
                        <button
                          onClick={() => {
                            Swal.fire({
                              title: "Are you sure?",
                              text: "Mark this order as done?",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              cancelButtonColor: "#d33",
                              confirmButtonText: "Yes, mark as done!",
                            }).then(async (result) => {
                              if (result.isConfirmed) {
                                toast.promise(
                                  app.patch(
                                    `/orders/order-update/${order._id}`
                                  ),
                                  {
                                    loading: "Updating...",
                                    success: (response) =>
                                      response.data.message ||
                                      "Updated successfully",
                                    error: (err) =>
                                      err.response.data.message ||
                                      "Can't update the state",
                                  }
                                );
                                refetch();
                              }
                            });
                          }}
                          className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600 transition duration-200 shadow-md"
                        >
                          Done
                        </button>
                      )}
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

export default OrderTable;
