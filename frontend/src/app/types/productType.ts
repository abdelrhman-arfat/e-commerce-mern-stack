import { TResponse } from "./responseTypes";

export type TProduct = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  image: string;
  category?: string;
  isDone?: boolean;
  quantity?: number;
  userId: string | { fullname: string; email: string; _id: string };
  likes: { userId: string; createdAt: Date; updatedAt: Date }[];
  comments: {
    userId: string;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
  };
  products: {
    productId: {
      quantity: number;
      price: number;
      title: string;
      image: string;
      category: string;
      _id: string;
    }[];
    userId: {
      fullname: string;
      email: string;
      _id: string;
    }[];
  };
  productId?:
    | {
        quantity: number;
        isDone: boolean;
        price: number;
        title: string;
        image: string;
        category: string;
        _id: string;
      }
    | string;
};

export type TProducts = TResponse<TProduct>;
