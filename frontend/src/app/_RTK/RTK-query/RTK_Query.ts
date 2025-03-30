import { TCategories } from "@/app/types/CategoryType";
import { TProducts } from "@/app/types/productType";
import { TUsers } from "@/app/types/userTypes";
import { API_URL } from "@/app/utils/constants/api_url";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ecommerceAPI = createApi({
  reducerPath: "ecommerceAPI",
  baseQuery: fetchBaseQuery({
    credentials: "include",
    baseUrl: API_URL,
  }),
  endpoints: (builder) => ({
    getAllCategories: builder.query<TCategories, void>({
      query: () => "/category",
    }),
    getAllInFav: builder.query<TProducts, void>({
      query: () => "/favorites",
    }),
    getAllOrders: builder.query<TProducts, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 30 }) =>
        `/orders?page=${+page || 1}&limit=${+limit || 30}`,
    }),
    getAllInCart: builder.query<TProducts, void>({
      query: () => "/cart",
    }),
    getAllProducts: builder.query<TProducts, { page?: number; limit?: number }>(
      {
        query: ({ page = 1, limit = 12 }) =>
          `/products?page=${page}&limit=${limit}`,
      }
    ),
    getRandomProducts: builder.query<TProducts, void>({
      query: () => "/products/random-products",
    }),
    getAllUser: builder.query<TUsers, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) =>
        `/admin/all-users?page=${+page || 1}&limit=${+limit || 30}`,
    }),
  }),
});
export const {
  useGetRandomProductsQuery,
  useGetAllCategoriesQuery,
  useGetAllProductsQuery,
  useGetAllUserQuery,
  useGetAllInFavQuery,
  useGetAllInCartQuery,
  useGetAllOrdersQuery,
} = ecommerceAPI;
