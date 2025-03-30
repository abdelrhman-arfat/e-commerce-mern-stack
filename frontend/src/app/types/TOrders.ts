import { TResponse } from "./responseTypes";

export type TOrder = {
  productId?: string;
};
export type TOrders = TResponse<TOrder>;
