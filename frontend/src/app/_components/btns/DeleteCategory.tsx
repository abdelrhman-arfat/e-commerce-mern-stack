"use client";
import { TCategories } from "@/app/types/CategoryType";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { FaTrash, FaTimes } from "react-icons/fa";
import app from "@/app/utils/axios_setting";

const DeleteCategory = ({
  data,
  refetch,
}: {
  data: TCategories | undefined;
  refetch: () => void;
}) => {
  const [showList, setShowList] = useState(false);
  if (!data) return null;

  const handleDelete = async (categoryId: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      toast
        .promise(app.delete(`/admin/delete-category/${categoryId}`), {
          loading: "Deleting category...",
          success: (res) => {
            return res.data.message || "Deleted category successfully";
          },
          error: (err) => {
            return (
              err.response?.data?.message ||
              "An error occurred while deleting the category"
            );
          },
        })
        .then(() => {
          refetch();
        });
    }
  };

  return (
    <div className="">
      <button
        onClick={() => setShowList(!showList)}
        className=" hover:bg-blue-500 bg-blue-600 duration-200 text-white p-2 rounded-md "
      >
        Toggle Categories
      </button>
      {showList && (
        <div className="min-h-[400px] w-[300px] flex flex-col gap-5 items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  bg-white shadow-lg p-4 z-40">
          <button
            onClick={() => setShowList(false)}
            className="absolute top-4 right-4 text-xl text-gray-700"
          >
            <FaTimes />
          </button>
          {Array.isArray(data?.results) &&
            data.results.map((category) => (
              <div key={category._id} className="flex gap-5 items-center ">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={48}
                  height={48}
                  className="rounded"
                />
                <span className="min-w-[130px]">{category.name}</span>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DeleteCategory;
