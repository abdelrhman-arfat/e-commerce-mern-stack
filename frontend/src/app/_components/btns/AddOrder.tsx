import React, { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import app from "@/app/utils/axios_setting";

const OrderButton = ({ id }: { id: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleOrderNow = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to start this order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Order Now!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      toast.promise(
        app.post("/orders/new-order", {
          product_id: id,
          quantity: quantity,
        }),
        {
          loading: "Sending your order...",
          success: (res) => {
            return res.data.message || "success";
          },
          error: (err) => err.response.message || "Something went wrong",
        }
      );
    }
  };

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 w-full mt-4"
      >
        Order Now
      </button>

      {isModalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
          style={{ zIndex: 999 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Enter Quantity</h2>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="border p-2 w-full rounded-lg mb-4"
              min="1"
            />
            <div className="flex justify-between">
              <button
                onClick={handleOrderNow}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Confirm Order
              </button>
              <button
                onClick={closeModal}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderButton;
