import { TCategories } from "@/app/types/CategoryType";
import { TProducts } from "@/app/types/productType";
import { API_URL } from "@/app/utils/constants/api_url";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ecommerceAPI = createApi({
  reducerPath: "ecommerceAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  endpoints: (builder) => ({
    getAllCategories: builder.query<TCategories, void>({
      query: () => "/category",
    }),
    getAllProducts: builder.query<TProducts, { page?: number; limit?: number }>(
      {
        query: ({ page = 1, limit = 12 }) =>
          `/products/all-products?page=${page}&limit=${limit}`,
      }
    ),
    getRandomProducts: builder.query<TProducts, void>({
      query: () => "/products/random-products",
    }),
  }),
});
export const {
  useGetRandomProductsQuery,
  useGetAllCategoriesQuery,
  useGetAllProductsQuery,
} = ecommerceAPI;
