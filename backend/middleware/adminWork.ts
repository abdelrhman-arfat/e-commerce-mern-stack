import { Response, Request, NextFunction } from "express";

const adminWork = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  if (user.role !== "ADMIN") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  next();
};

export default adminWork;
