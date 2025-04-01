import { TResponse } from "./responseTypes";

export type TProduct = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  image: string;
  category: string;
  isDone: boolean;
  quantity: number;
  products: {
    productId: {
      quantity: number;
      price: number;
      title: string;
      image: string;
      category: string;
      _id: string;
    }[];
    userId: string | { fullname: string; email: string; _id: string };
  }[];
  likes: {
    user: {
      fullname: string;
      email: string;
      _id: string;
      profilePicture: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }[];
  comments: {
    user: {
      fullname: string;
      email: string;
      _id: string;
      profilePicture: string;
    };
    _id: string;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  userId: string | { fullname: string; email: string; _id: string };

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
