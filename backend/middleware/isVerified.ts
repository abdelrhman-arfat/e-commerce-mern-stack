import { NextFunction, Request, Response } from "express";

export default function isVerified(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user;
  const { isVerified } = user;
  if (!isVerified) {
    res.status(403).json({
      message: "please verify your email first and try again",
      error: "not verified",
      code: 403,
      results: [],
    });
    return;
  }
  next();
}
