import { Request, Response } from "express";
import {
  signupService,
  loginService,
  refreshTokenService,
  forgotPasswordService,
  resetPasswordService,
} from "./auth.service";
import { signupSchema, loginSchema } from "./auth.validation";
import z from "zod";
import crypto from "crypto";
import { User } from "../users/user.model";
import { AppError } from "../../utils/AppError";

export const signup = async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: z.flattenError(parsed.error).fieldErrors,
    });
  }

  const { user, accessToken, refreshToken } =
    await signupService(parsed.data);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      referralCode: user.referralCode,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: z.flattenError(parsed.error).fieldErrors,
    });
  }

  const { user, accessToken, refreshToken } =
    await loginService(parsed.data.email, parsed.data.password);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.userType,
    },
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const { newAccessToken, newRefreshToken } =
    await refreshTokenService(token);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.json({ accessToken: newAccessToken });
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (token) {
    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    await User.updateOne(
      { refreshToken: hashed },
      { $unset: { refreshToken: 1 } }
    );
  }

  res.clearCookie("refreshToken");
  res.json({ success: true, message: "Logged out" });
};

export const forgotPassword = async (req: Request, res: Response) => {
  await forgotPasswordService(req.body.email);
  res.json({
    success: true,
    message: "If the email exists, a reset link has been sent",
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const token = req.params.token;
  const { password } = req.body;

  if (!token || typeof token !== "string") {
    throw new AppError("Invalid or missing reset token", 400);
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  await resetPasswordService(token, password);

  res.json({
    success: true,
    message: "Password reset successful",
  });
};