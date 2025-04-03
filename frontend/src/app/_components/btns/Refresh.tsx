"use client";
import React from "react";
const Refresh = ({
  refetch,
}: {
  refetch: () => void; // Function to refresh data in parent component.
}) => {
  return (
    <button
      className="text-xl my-2 px-4 py-2 rounded-md text-white hover:bg-five duration-300 bg-six"
      onClick={() => {
        refetch();
      }}
    >
      Refresh
    </button>
  );
};

export default React.memo(Refresh);
