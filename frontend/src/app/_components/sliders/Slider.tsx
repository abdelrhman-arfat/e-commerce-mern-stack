import React from "react";

const Slider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      id="category-slider"
      className="mt-5 mb-2 px-6 py-4 flex w-full overflow-x-auto gap-10"
    >
      {children}
    </div>
  );
};

export default Slider;
