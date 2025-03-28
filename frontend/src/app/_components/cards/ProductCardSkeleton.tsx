const ProductCardSkeleton = () => {
  return (
    <div className=" bg-gray-500  animate-pulse rounded-md w-full group ">
      <div className="group-hover:flex none"></div>
      <div className="relative  flex flex-col  bg-gray-400 animate-pulse  shadow-sm border border-slate-200 rounded-lg ">
        <div className="relative h-[230px] m-2.5 overflow-hidden px-4  bg-gray-300 animate-pulse text-white rounded-md"></div>
        <div className="p-4">
          <div className="mb-4 rounded-full animate-pulse h-7 bg-gray-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-20 flex items-center justify-center ">
            100$
          </div>
          <h6 className="mb-2 px-4 py-2 animate-pulse bg-gray-400 text-xl font-semibold"></h6>
          <p className="w-full py-3 bg-gray-400 animate-pulse line-clamp-2  font-light"></p>
        </div>

        <div className="flex items-center justify-between py-1 px-4 animate-pulse bg-gray-300"></div>
        <div className="w-full text-center h-[30px] bg-gray-300 animate-pulse">
          View
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
