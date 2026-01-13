import { Request, Response, NextFunction } from "express";
import { Role } from "../constants/roles.constants";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== Role.ADMIN) {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }

  next();
};
