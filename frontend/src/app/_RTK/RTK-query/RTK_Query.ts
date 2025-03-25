import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type TCategory = {
  name: string;
};

export const ecommerceAPI = createApi({
  reducerPath: "ecommerceAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  endpoints: (builder) => ({
    getAllCategories: builder.query<TCategory, void>({
      query: () => "/category",
    }),
  }),
});
export const { useGetAllCategoriesQuery } = ecommerceAPI;
