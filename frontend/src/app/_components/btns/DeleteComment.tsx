import app from "@/app/utils/axios_setting";
import React from "react";
import toast from "react-hot-toast";

const DeleteComment = ({
  id,
  comment,
  refetch,
}: {
  id: string;
  comment: { _id: string };
  refetch: () => void;
}) => {
  return (
    <button
      onClick={() => {
        toast.promise(
          app.delete(
            `/products/delete-comment?product_id=${id}&comment_id=${comment._id}`
          ),
          {
            loading: "delete comment",
            success: (res) => {
              if (res.status === 200) {
                refetch();
              }
              return res.data.message || "deleted successfully";
            },
            error: (err) => {
              return (
                err.response?.data?.message ||
                "An error occurred while Deleteing comment"
              );
            },
          }
        );
      }}
      className="text-sm bg-red-500 text-white hover:scale-105 px-2 py-1 rounded-md transition-all duration-300"
    >
      Delete
    </button>
  );
};

export default DeleteComment;
