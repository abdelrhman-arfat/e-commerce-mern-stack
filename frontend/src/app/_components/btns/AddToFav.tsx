"use client";

import app from "@/app/utils/axios_setting";
import toast from "react-hot-toast";
import { BsHeart } from "react-icons/bs";

const AddToFav = ({
  isInFav,
  _id,
  refetch,
}: {
  isInFav: boolean;
  _id: string;
  refetch: () => void;
}) => {
  return (
    <button
      className={`${
        isInFav ? "bg-love text-white" : "text-red-500 bg-gray-100"
      } p-1.5 flex items-center justify-center rounded-xl hover:scale-105`}
      onClick={() => {
        toast.promise(app.post(`/favorites/${_id}`), {
          loading: isInFav ? "delete form favorites..." : "add to favorites...",
          success: (res) => {
            refetch();
            return res?.data?.message || "operation completed successfully";
          },
          error: (err) => {
            return (
              err.response?.data?.message ||
              "An error occurred while adding to favorites"
            );
          },
        });
      }}
    >
      <BsHeart size={"16px"} />
    </button>
  );
};

export default AddToFav;
