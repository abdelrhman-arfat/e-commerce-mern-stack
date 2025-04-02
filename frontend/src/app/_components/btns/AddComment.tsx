import app from "@/app/utils/axios_setting";
import React, { useState } from "react";
import { toast } from "react-hot-toast"; // Import toast from react-hot-toast

const AddComment = ({
  productId,
  refetch,
}: {
  productId: string;
  refetch: () => void;
}) => {
  const [isCommenting, setIsCommenting] = useState(false);
  const [comment, setComment] = useState("");

  const handleAddCommentClick = () => {
    setIsCommenting(true);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (comment.trim()) {
      // Simulate an API call to submit the comment
      toast.promise(
        app.post(`/products/comment/${productId}`, {
          comment,
        }),
        {
          loading: "Submitting your comment...",
          success: (res) => {
            refetch();
            return res.data.message || "Comment added successfully";
          },

          error: (err) =>
            err.response?.data?.message || "Failed to add comment.",
        }
      );

      // After success, reset the comment input
      setComment("");
      setIsCommenting(false);
    } else {
      toast.error("The comment can't be empty.");
    }
  };

  return (
    <div>
      {!isCommenting ? (
        <button
          onClick={handleAddCommentClick}
          className="mt-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
        >
          Add Comment
        </button>
      ) : (
        <div className="mt-4 flex md:flex-row flex-col md:items-center md:gap-3 space-y-3">
          <div>
            <input
              type="text"
              value={comment}
              onChange={handleCommentChange}
              className="px-3 py-3 border border-gray-300 rounded-md"
              placeholder="Write your comment..."
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleSubmit}
              className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
            >
              Submit
            </button>
            <button
              onClick={() => setIsCommenting(false)}
              className="text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddComment;
