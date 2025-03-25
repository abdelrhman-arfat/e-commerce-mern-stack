import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV } from "../constants/envVar";

declare global {
  namespace Express {
    interface Request {
      user?: any;
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
        message: "Not authenticated",
      });
      return;
    }
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) {
      res.status(401).json({
        error: null,
        results: [],
        code: 401,
        message: "Not authenticated",
      });
      return;
    }

    const deCoded = await jwt.verify(token, JWT_SECRET as string);

    if (!deCoded) {
      res.status(401).json({
        error: null,
        code: 401,
        results: [],
        message: "Not authenticated",
      });

      res.clearCookie("jwt", {
        httpOnly: true,
        secure: NODE_ENV === "production",
        maxAge: 0,
        sameSite: "strict",
      });
      res.clearCookie("token", {
        httpOnly: true,
        secure: NODE_ENV === "production",
        maxAge: 0,
        sameSite: "strict",
      });

      return;
    }

    req.user = deCoded;
    next();
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: "Bad Request",
      code: 500,
      results: null,
      error: error.message,
    });
  }
};
export default protectedMiddleware;
