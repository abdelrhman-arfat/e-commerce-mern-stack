import { TResponse } from "./responseTypes";

export type TUser = {
  isAuthenticated: boolean;
  user?:TUserInResponse;
};

export type TUserInResponse = {
  _id?: string;
  username?: string;
  email?: string;
  fullname?: string;
  profilePicture?: string;
  isVerified?: boolean;
  role?: "ADMIN" | "USER";
};
export type TUsers = TResponse<TUserInResponse>;
