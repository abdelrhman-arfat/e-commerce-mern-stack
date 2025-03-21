import jwt from "jsonwebtoken";
import { TUserInfo } from "../types/userInfo.js";
import { JWT_REFRESH_SECRET } from "../constants/envVar.js";

const webRefreshToken = async (userInfo: TUserInfo) => {
  try {
    const refreshToken = await jwt.sign(
      {
        _id: userInfo._id,
        email: userInfo.email,
        username: userInfo.username,
        role: userInfo.role,
      },
      JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );
    return refreshToken;
  } catch (error) {
    const err = error as Error;
    throw new Error("Failed to generate refresh token", err);
  }
};
export default webRefreshToken;
