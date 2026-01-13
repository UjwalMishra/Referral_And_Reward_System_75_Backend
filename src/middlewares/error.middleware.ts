import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // our custom errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Native JS Error
  if (err instanceof Error) {
    console.error("UNEXPECTED ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }

  // Truly unknown case
  console.error("UNKNOWN THROW:", err);

  return res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again later.",
  });
};
