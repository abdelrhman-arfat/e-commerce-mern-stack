import React from "react";

const CategorySkeletonCard = () => {
  return (
    <div className="flex items-center flex-col gap-4 py-3 ">
      <div className="relative bg-gray-400 animate-pulse w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] flex justify-center items-center  rounded-full  shadow-sm "></div>
      <div>
        <h3 className="animate-pulse bg-gray-400 min-h-[20px] min-w-[100px]"></h3>
      </div>
    </div>
  );
};

export default CategorySkeletonCard;
