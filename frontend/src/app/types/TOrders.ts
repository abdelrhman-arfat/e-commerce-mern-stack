import { TResponse } from "./responseTypes";

export type TIOrder = {
  quantity: number;
  isDone: boolean;
  price: number;
  productId?: {
    title: string;
    image: string;
    category: string;
    _id: string;
  };
  title: string;
  image: string;
  category: string;
  _id: string;
};

export type TOrder = {
  _id: string | undefined;
  isDone: boolean;
  productId?: TIOrder;

  quantity: number;
  userId: {
    _id: string;
    fullname: string;
    email: string;
    profilePicture: string;
  };
};
export type TOrders = TResponse<TOrder>;
