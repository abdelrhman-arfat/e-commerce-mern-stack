import { NextFunction, Request, Response } from "express";
import sendEmailForVerification from "../utils/sendEmail.js";

export default async function isVerified(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isVerified = req?.user?.isVerified;
  if (!isVerified) {
    await sendEmailForVerification(req.user);
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
