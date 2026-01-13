import { Request, Response } from "express";
import { User } from "./user.model";
import { ReferralModel } from "../refferals/referral.model";
import { RewardModel } from "../rewards/reward.model";
import { RewardStatus } from "../rewards/reward.types";

export const getUserDashboard = async (
  req: Request,
  res: Response
) => {
  const userId = req.user!.id;

  const user = await User.findById(userId).select(
    "name email userType referralCode"
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const [totalReferrals, totalEarnings] = await Promise.all([
    ReferralModel.countDocuments({ inviter: userId }),
    RewardModel.aggregate([
      {
        $match: {
          user: user._id,
          status: RewardStatus.PAID,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      name: user.name,
      email: user.email,
      userType: user.userType,
      referralCode: user.referralCode,
      totalReferrals,
      totalEarnings: totalEarnings[0]?.total || 0,
    },
  });
};
