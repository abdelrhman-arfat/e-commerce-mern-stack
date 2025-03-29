import { NextFunction, Request, Response } from "express";
import sendEmailForVerification from "../utils/sendEmail.js";

export default async function isVerified(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req?.user;
  if (!user?.isVerified) {
    await sendEmailForVerification({
      _id: user?._id,
      email: user?.email,
      username: user?.username,
      role: user?.role,
      isVerified: user?.isVerified,
    });
    res.status(403).json({
      message:
        "Your account hasn't been verified ,check your gmail account and try again",
      error: "not verified",
      code: 403,
      results: [],
    });
    return;
  }
  next();
}
