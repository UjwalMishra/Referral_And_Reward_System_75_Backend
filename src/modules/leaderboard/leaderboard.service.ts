import { RewardModel } from "../rewards/reward.model";
import { ReferralModel } from "../refferals/referral.model";
import { UserType } from "../users/user.types";

interface LeaderboardParams {
  page: number;
  limit: number;
}

export const getLeaderboardService = async ({
  page,
  limit,
}: LeaderboardParams) => {
  const skip = (page - 1) * limit;

  const leaderboard = await RewardModel.aggregate([
    // Group rewards by inviter (user)
    {
      $group: {
        _id: "$user",
        totalEarnings: { $sum: "$amount" },
      },
    },

    // Join users
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },

    // Count referrals
    {
      $lookup: {
        from: "referrals",
        localField: "_id",
        foreignField: "inviter",
        as: "referrals",
      },
    },

    {
      $addFields: {
        totalReferrals: { $size: "$referrals" },
        omniReferrals: {
          $size: {
            $filter: {
              input: "$referrals",
              as: "ref",
              cond: { $eq: ["$$ref.invitedUserType", UserType.OMNI] },
            },
          },
        },
      },
    },

    // Sort by earnings then referrals
    {
      $sort: {
        totalEarnings: -1,
        totalReferrals: -1,
      },
    },

    // Pagination
    { $skip: skip },
    { $limit: limit },

    // Final shape
    {
      $project: {
        _id: 0,
        userId: "$user._id",
        name: "$user.name",
        email: "$user.email",
        totalEarnings: 1,
        totalReferrals: 1,
        omniReferrals: 1,
      },
    },
  ]);

  return leaderboard;
};
