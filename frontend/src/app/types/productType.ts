import { TResponse } from "./responseTypes";

export type TProduct = {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
};

export type TProducts = TResponse<TProduct>;
