"use client";
import React from "react";
import Swal from "sweetalert2";
import app from "@/app/utils/axios_setting";
import Image from "next/image";
import { useGetUserOrdersQuery } from "@/app/_RTK/RTK-query/RTK_Query";
import toast from "react-hot-toast";
import Error from "@/app/_components/lodingAndErrors/Error";
import Loader from "@/app/_components/lodingAndErrors/Loader";
import { TOrder } from "@/app/types/TOrders";

const Page = () => {
  // Fetching orders data using the hook
  const { data, isLoading, isError, refetch } = useGetUserOrdersQuery();

  const handleDeleteOrder = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No, Keep",
    });

    if (result.isConfirmed) {
      toast.promise(app.delete(`/orders/delete-order/${orderId}`), {
        loading: "Deleting the order...",
        success: (res) => {
          refetch();
          return res.data.message || "Order deleted successfully";
        },
        error: "Failed to delete the order",
      });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <div className="orders-list">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {Array.isArray(data?.results) && data?.results?.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {Array.isArray(data?.results) &&
            data?.results.map(
              (order: TOrder) =>
                order.productId &&
                typeof order.productId === "object" && (
                  <div
                    key={order._id}
                    className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md"
                  >
                    <div className="flex items-center">
                      <Image
                        width={400}
                        height={400}
                        src={order?.productId?.image || ""}
                        alt={order?.productId?.title || ""}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">
                          {order.productId?.title || "Unknown Product"}
                        </h3>
                        <p>Quantity: {order.quantity}</p>
                        <p className="text-sm text-gray-500">
                          Price: $
                          {(order?.productId?.price * order.quantity).toFixed(
                            2
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteOrder(order._id as string)}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                )
            )}
        </div>
      )}
    </div>
  );
};

export default Page;
