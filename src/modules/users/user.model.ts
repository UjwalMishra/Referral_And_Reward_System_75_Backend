import { Schema, model, Types } from "mongoose";
import { UserType } from "./user.types";
import { Role } from "../../constants/roles.constants";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: Role;

  userType: UserType;
  referralCode: string;
  referredBy?: Types.ObjectId;

  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    userType: {
      type: String,
      enum: Object.values(UserType),
      default: UserType.NORMAL,
    },

    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },

    referralCode: {
      type: String,
      required: true,
      unique: true,
    },

    referredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    refreshToken: {
      type: String,
      select: false,
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
