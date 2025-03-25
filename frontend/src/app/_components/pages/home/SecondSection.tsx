import React from "react";
import CategoriesData from "./CategoriesData";

const SecondSection = () => {
  return (
    <section className="w-full h-[300px]">
      <h2 className="text-xl sm:text-2xl md:text-3xl uppercase font-bold text-center text-gray-900">
        Our Categories
      </h2>
      {/* 
        category Data:
      */}
      <CategoriesData />
    </section>
  );
};

export default SecondSection;
