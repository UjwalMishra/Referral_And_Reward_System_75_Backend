import crypto from "crypto";
import { User } from "../users/user.model";
import { ReferralModel } from "../refferals/referral.model";
import { RewardModel } from "../rewards/reward.model";
import { AppError } from "../../utils/AppError";
import { hashPassword, comparePassword } from "../../utils/hash";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { generateReferralCode } from "../../utils/generateRefferalCode";
import { calculateReward } from "../../utils/calculateReward";
import { UserType } from "../users/user.types";
import { mailTransporter } from "../../config/mail.config";

interface SignupInput {
  name: string;
  email: string;
  password: string;
  referralCode?: string;
  userType?: UserType;
}

// SIGNUP
export const signupService = async ({
  name,
  email,
  password,
  referralCode,
  userType,
}: SignupInput) => {
  if (await User.findOne({ email })) {
    throw new AppError("User already exists", 409);
  }

  let inviter = null;
  if (referralCode) {
    inviter = await User.findOne({ referralCode });
    if (!inviter) {
      throw new AppError("Invalid referral code", 400);
    }
  }

  const finalUserType =
    userType === UserType.OMNI ? UserType.OMNI : UserType.NORMAL;

  const user = await User.create({
    name,
    email,
    password: await hashPassword(password),
    userType: finalUserType,
    referralCode: generateReferralCode(),
    referredBy: inviter?._id,
  });

  if (inviter) {
    const referral = await ReferralModel.create({
      inviter: inviter._id,
      invitedUser: user._id,
      invitedUserType: user.userType,
    });

    await RewardModel.create({
      user: inviter._id,
      referral: referral._id,
      amount: calculateReward(user.userType),
    });
  }

  const accessToken = signAccessToken({
    userId: user.id,
    userType: user.userType,
    role: user.role,
  });

  const refreshToken = signRefreshToken({ userId: user.id });

  user.refreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await user.save();

  return { user, accessToken, refreshToken };
};


// LOGIN
export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = signAccessToken({
    userId: user.id,
    userType: user.userType,
    role: user.role,
  });

  const refreshToken = signRefreshToken({ userId: user.id });

  user.refreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await user.save();

  return { user, accessToken, refreshToken };
};

// FORGOT PASSWORD
export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) return;

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  const resetLink = `http://localhost:8000/reset-password/${resetToken}`;

  await mailTransporter.sendMail({
    from: `"Chat App" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link expires in 10 minutes</p>
    `,
  });
};

// RESET PASSWORD 
export const resetPasswordService = async (
  token: string,
  newPassword: string
) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError("Token is invalid or expired", 400);
  }

  user.password = await hashPassword(newPassword);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
};

// REFRESH TOKEN 
export const refreshTokenService = async (token: string) => {
  const decoded = verifyRefreshToken(token) as { userId: string };

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findById(decoded.userId).select("+refreshToken");

  if (!user || user.refreshToken !== hashedToken) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const newAccessToken = signAccessToken({
    userId: user.id,
    userType: user.userType,
    role: user.role,
  });

  const newRefreshToken = signRefreshToken({ userId: user.id });

  user.refreshToken = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  await user.save();

  return { newAccessToken, newRefreshToken };
};
