import z from "zod";
import { UserType } from "../users/user.types";

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  userType: z.enum(UserType).optional(),
  password: z.string().min(6),
  referralCode: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
