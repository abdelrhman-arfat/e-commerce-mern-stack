"use client";

import { TCategory } from "@/app/types/CategoryType";
import CategoryCard from "../cards/CategoryCard";

import { useGetAllCategoriesQuery } from "@/app/_RTK/RTK-query/RTK_Query";
import CategorySkeletonCard from "../cards/CategorySkeletonCard";
import Slider from "../sliders/Slider";

const CategoriesData = () => {
  const { data, isLoading, isError } = useGetAllCategoriesQuery();
  if (isLoading) {
    return (
      <Slider>
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <CategorySkeletonCard key={`category-skeleton-${index}`} />
          ))}
      </Slider>
    );
  }
  if (isError) {
    return <p className="text-red-600">Error fetching categories.</p>;
  }

  return (
    <div className="mt-6">
      {Array.isArray(data?.results) && data?.results?.length ? (
        <>
          <h2 className="text-xl sm:text-2xl md:text-3xl uppercase font-bold text-center text-gray-900">
            Our Categories
          </h2>
          <Slider>
            {data?.results?.map((item: TCategory, index: number) => (
              <CategoryCard item={item} key={item.name + "category" + index} />
            ))}
          </Slider>
        </>
      ) : (
        <div className="w-full text-xl bg-gray-200 shadow-sm py-3 text-center rounded-md">
          No categories found until now.
        </div>
      )}
    </div>
  );
};

export default CategoriesData;
