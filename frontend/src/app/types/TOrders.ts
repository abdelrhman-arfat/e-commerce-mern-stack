import { TResponse } from "./responseTypes";

export type TIOrder = {
  quantity: number;
  isDone: boolean;
  price: number;
  title: string;
  image: string;
  category: string;
  _id: string;
};

export type TOrder = {
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
