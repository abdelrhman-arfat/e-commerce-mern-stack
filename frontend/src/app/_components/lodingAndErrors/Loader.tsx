import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading orders...</p>
      </div>
    </div>
  );
};

export default Loader;
