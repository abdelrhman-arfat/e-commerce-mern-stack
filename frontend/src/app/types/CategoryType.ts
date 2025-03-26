import { TResponse } from "./responseTypes";

export type TCategory = {
  name: string;
  image: string;
  _id: string;
};

export type TCategories = TResponse<TCategory>;


