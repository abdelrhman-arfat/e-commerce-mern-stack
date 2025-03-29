import jwt from "jsonwebtoken";
import { TUserInfo } from "../types/userInfo.js";
import { JWT_SECRET } from "../constants/envVar.js";

const webAccessToken = async (userInfo: TUserInfo) => {
  try {
    const accessToken = await jwt.sign(
      {
        _id: userInfo._id,
        email: userInfo.email,
        username: userInfo.username,
        role: userInfo.role,
        isVerified: userInfo.isVerified,
      },
      JWT_SECRET as string,
      { expiresIn: "20m" }
    );
    return accessToken;
  } catch (error) {
    const err = error as Error;
    throw new Error("Failed to generate JWT access token", err);
  }
};
export default webAccessToken;
