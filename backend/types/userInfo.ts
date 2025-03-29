import { ObjectId } from "mongoose";

export type TUserInfo = {
  username?: string;
  email?: string;
  _id?: ObjectId;
  isVerified?: boolean;
  role?: string;
};
