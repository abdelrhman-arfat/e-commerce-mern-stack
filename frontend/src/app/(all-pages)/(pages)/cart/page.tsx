"use client";
import { useGetAllInCartQuery } from "@/app/_RTK/RTK-query/RTK_Query";
import React from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import app from "@/app/utils/axios_setting";

// Define the types for the product and cart structure
type Product = {
  productId: {
    _id: string;
    image: string;
    title: string;
    price: number;
  };
  quantity: number;
};
interface Cart {
  products: Product[];
  // other properties if needed
}
const CartPage = () => {
  const { data, refetch } = useGetAllInCartQuery();

  const cart = data?.results as Cart;
  const products = cart?.products || [];
  const totalPrice = products.reduce(
    (acc, product) => acc + product.quantity * product.productId.price,
    0
  );

  const handleOrderNow = async (data: {
    product_id: string;
    quantity: number;
  }) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Start This order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Order Now!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      toast.promise(
        app.post("/orders/new-order", {
          product_id: data.product_id,
          quantity: data.quantity,
        }),
        {
          loading: "Sending your order...",
          success: (res) => {
            Swal.fire({
              title: "Order is Done",
              text: "Do you want to remove this item from your cart?",
              icon: "success",
              draggable: true,
              showCancelButton: true,
              confirmButtonText: "Yes, Remove",
              cancelButtonText: "No, Keep",
            }).then((result) => {
              if (result.isConfirmed) {
                toast.promise(
                  app.delete(`/cart/delete-cart/${data.product_id}`),
                  {
                    loading: "Removing item from cart...",
                    success: () => {
                      refetch();
                      return "Item removed successfully";
                    },
                    error: "Failed to remove item from cart.",
                  }
                );
              }
            });
            return res.data.message || "success";
          },
          error: (err) => err.response.message || "Something went wrong",
        }
      );
    }
  };

  const handleUpdateQuantity = async (product_id: string, quantity: number) => {
    if (quantity <= 0) {
      handleDeleteProduct(product_id);
      return;
    }
    toast.promise(app.patch(`/cart/update-cart`, { product_id, quantity }), {
      loading: "Updating quantity...",
      success: () => {
        refetch();
        return "Quantity updated successfully!";
      },
      error: "Failed to update quantity.",
    });
  };

  const deleteProduct = (product_id: string) => {
    toast.promise(app.delete(`/cart/delete-cart/${product_id}`), {
      loading: "Removing item...",
      success: () => {
        refetch();
        return "Item removed successfully!";
      },
      error: "Failed to remove item.",
    });
  };
  const handleDeleteProduct = async (product_id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this item from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      deleteProduct(product_id);
    }
  };

  return (
    <div className="space-y-6 px-8 py-8 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Your Cart</h1>

      <div className="space-y-6">
        {products?.map((product) => (
          <div
            key={product.productId._id}
            className="border rounded-lg p-4 shadow-lg flex flex-col sm:flex-row items-center w-full bg-white"
          >
            <div className="w-full sm:w-1/3 flex justify-center mb-4 sm:mb-0">
              <Image
                src={product.productId.image}
                alt={product.productId.title}
                width={150}
                height={150}
                className="object-cover rounded"
              />
            </div>

            <div className="w-full sm:w-2/3 flex flex-col justify-between px-4">
              <h3 className="text-xl font-semibold">
                {product.productId.title}
              </h3>
              <div className="w-full flex items-center justify-between">
                <p className="text-gray-600 mt-2">${product.productId.price}</p>

                <p className="text-green-600">
                  Total :$
                  {(product.productId.price * product.quantity).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        product.productId._id,
                        product.quantity - 1
                      )
                    }
                    className="bg-gray-300 text-black px-3 py-1 rounded-l-lg hover:bg-gray-400"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-gray-200">
                    {product.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        product.productId._id,
                        product.quantity + 1
                      )
                    }
                    className="bg-gray-300 text-black px-3 py-1 rounded-r-lg hover:bg-gray-400"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleDeleteProduct(product.productId._id)}
                  className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </div>

              <button
                onClick={() =>
                  handleOrderNow({
                    product_id: product.productId._id,
                    quantity: product.quantity,
                  })
                }
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 w-full mt-4"
              >
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center font-bold text-xl">
        <p>Total Price: ${totalPrice.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default CartPage;
