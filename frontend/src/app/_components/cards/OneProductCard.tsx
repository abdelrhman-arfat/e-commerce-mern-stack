"use client";
import React from "react";
import { useGetProductByIdQuery } from "@/app/_RTK/RTK-query/RTK_Query";
import Image from "next/image";
import { BsHeart } from "react-icons/bs";
import AddComment from "../btns/AddComment";
import useUserSelector from "@/app/hooks/AppSelector";
import toast from "react-hot-toast";
import app from "@/app/utils/axios_setting";
import DeleteComment from "../btns/DeleteComment";
import OrderButton from "../btns/AddOrder";

const OneProductCard = ({ id }: { id: string }) => {
  const { data, isError, isLoading, refetch } = useGetProductByIdQuery(id);
  const me = useUserSelector();
  const isIn = data?.results?.likes?.filter(
    (like) => like?.user?.email == me?.user?.email
  );
  const handleLikeClick = () => {
    toast.promise(app.patch(`/products/like/${id}`), {
      loading: isIn?.length ? "Delete like" : "Add like ...",
      success: (res) => {
        refetch();
        return res.data.message || "Success";
      },
      error: (err) => {
        return (
          err.response?.data?.message ||
          "An error occurred while adding to favorites"
        );
      },
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const results = data?.results;

  return (
    <div className="product-detail w-full sm:w-[97%] md:min-w-[500px] bg-white p-6 rounded-lg shadow-xl max-w-2xl mx-auto mt-10">
      {/* Post Header: User Avatar and Post Time */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gray-300"></div>{" "}
        {/* Placeholder for avatar */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {results?.title}
          </h3>
          <p className="text-sm text-gray-500">{}</p>
        </div>
      </div>

      {/* Product Image */}
      <div className="relative w-full h-80 mb-6">
        <Image
          priority
          src={results?.image as string}
          alt={results?.title as string}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
      </div>

      {/* Post Description */}
      <p className="text-lg text-gray-600 mb-4">{results?.description}</p>

      {/* Price and Category */}
      <p className="text-xl font-semibold text-green-600">{`$${results?.price}`}</p>
      <p className="text-md text-gray-500">Category: {results?.category}</p>
      <OrderButton id={id} />

      {/* Like Button */}
      <div className="likes mt-4 flex items-center justify-start space-x-3">
        <button
          onClick={handleLikeClick}
          className={`text-2xl ${
            isIn?.length
              ? "bg-red-500 text-white hover:bg-red-300"
              : "hover:bg-red-500"
          }  transition-all hover:text-white  p-2 rounded-full duration-300`}
        >
          <BsHeart className="w-5 h-5" />
        </button>
        <p className="ml-2 text-lg">{results?.likes?.length}</p>
      </div>

      {/* Comments Section */}
      <div className="comments mt-6">
        <div className="md:flex items-center gap-3">
          <h3 className="text-2xl font-semibold text-gray-800">Comments</h3>
          <AddComment refetch={refetch} productId={id} />
        </div>
        {results?.comments && results.comments.length > 0 ? (
          <div className="comment-list mt-4 space-y-4">
            {results.comments.map((comment, index) => (
              <div
                key={index}
                className="comment flex gap-2 items-center bg-gray-100 p-4 rounded-md shadow-sm"
              >
                <Image
                  src={
                    comment?.user.profilePicture ||
                    "https://robohash.org/mail@ashallendesign.co.uk"
                  }
                  alt="user profile picture"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                  priority
                ></Image>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <p className="text-sm text-gray-400 ">
                      {comment.user.fullname}
                    </p>
                    <p className="text-gray-700">{comment?.comment}</p>
                  </div>
                </div>
                {me.user?.role === "ADMIN" ? (
                  <DeleteComment id={id} refetch={refetch} comment={comment} />
                ) : (
                  comment?.user?.email === me?.user?.email && (
                    <DeleteComment
                      id={id}
                      refetch={refetch}
                      comment={comment}
                    />
                  )
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-comments mt-4">
            <p className="text-lg text-gray-500">No comments yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OneProductCard;
