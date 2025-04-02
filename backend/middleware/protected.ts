import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants/envVar.js";
import { ObjectId } from "mongoose";
import { TUserInfo } from "../types/userInfo.js";

declare global {
  namespace Express {
    interface Request {
      user: {
        _id?: ObjectId;
        username?: string;
        email?: string;
        isVerified?: boolean;
        role?: string;
      };
    }
  }
}

const protectedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({
        error: null,
        results: [],
        code: 401,
        message: "You should login first",
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET as string) as TUserInfo;

    if (!decoded) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 0,
      });
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 0,
      });

      res.status(401).json({
        error: null,
        results: [],
        code: 401,
        message: "You should login first",
      });
      return;
    }

    req.user = decoded;

    next();
  } catch (error) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 0,
    });
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 0,
    });

    res.status(401).json({
      error: null,
      code: 401,
      results: [],
      message: "Not authenticated",
    });
  }
};

export default protectedMiddleware;
