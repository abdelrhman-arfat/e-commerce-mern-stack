import { Response, Request, NextFunction } from "express";

const adminWork = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    res.status(403).json({
      message: "Please login first",
      code: 403,
      error: "Unauthorized",
      results: [],
    });
    return;
  }

  if (user.role !== "ADMIN") {
    res.status(403).json({
      message: "Forbidden",
      error: "can't access this order ,اطلع برا",
      results: [],
      code: 403,
    });
    return;
  }
  next();
};

export default adminWork;
