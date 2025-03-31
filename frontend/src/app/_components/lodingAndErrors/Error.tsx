import React from "react";

const Error = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-md max-w-md">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline ml-2">
          Failed to fetch orders. Please try again later.
        </span>
      </div>
    </div>
  );
};

export default Error;
