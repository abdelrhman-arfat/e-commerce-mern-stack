import { TResponse } from "./responseTypes";


export type TProduct = {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  productId?:
    | {
        price: number;
        title: string;
        image: string;
        category: string;
        _id: string;
      }
    | string;
  userId?:
    | string
    | {
        fullname: string;
        email: string;
        _id: string;
      };
  likes?: {
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  comments?: {
    userId: string;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  quantity: number;
  image: string;
  category?: string;
  isDone: boolean;
};

export type TProducts = TResponse<TProduct>;
