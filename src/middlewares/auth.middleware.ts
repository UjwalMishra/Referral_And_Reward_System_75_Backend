import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { UserType } from "../modules/users/user.types";
import { Role } from "../constants/roles.constants";

interface AccessTokenPayload {
  userId: string;
  userType: UserType;
  role: Role,
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token) as AccessTokenPayload;

    req.user = {
      id: decoded.userId,
      userType: decoded.userType,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
