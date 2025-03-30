import { ObjectId } from "mongoose";

export type TUserInfo = {
  username?: string;
  email?: string;
  fullname?: string;
  _id?: ObjectId;
  isVerified?: boolean;
  role?: string;
};
