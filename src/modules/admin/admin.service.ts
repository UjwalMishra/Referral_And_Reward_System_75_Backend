import { RewardModel } from "../rewards/reward.model";
import { UserType } from "../users/user.types";

interface SimpleReportParams {
  page: number;
  limit: number;
  search?: string;
  minEarnings?: number;
  userType?: string;
}

export const getSimpleReferralReportService = async ({
  page,
  limit,
  search,
  minEarnings,
  userType,
}: SimpleReportParams) => {
  const skip = (page - 1) * limit;

  const pipeline: any[] = [
    // Group rewards by inviter
    {
      $group: {
        _id: "$user",
        totalEarnings: { $sum: "$amount" },
        totalReferrals: { $sum: 1 },
      },
    },

    // Filter by min earnings
    ...(minEarnings
      ? [
          {
            $match: {
              totalEarnings: { $gte: minEarnings },
            },
          },
        ]
      : []),

    // Join user
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },

    // Filter by userType
    ...(userType
      ? [
          {
            $match: {
              "user.userType": userType,
            },
          },
        ]
      : []),

    // Search by name/email
    ...(search
      ? [
          {
            $match: {
              $or: [
                { "user.name": { $regex: search, $options: "i" } },
                { "user.email": { $regex: search, $options: "i" } },
              ],
            },
          },
        ]
      : []),

    // Count total
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          { $sort: { totalEarnings: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 0,
              userId: "$user._id",
              name: "$user.name",
              email: "$user.email",
              userType: "$user.userType",
              totalReferrals: 1,
              totalEarnings: 1,
            },
          },
        ],
      },
    },
  ];

  const result = await RewardModel.aggregate(pipeline);

  const total = result[0]?.metadata[0]?.total || 0;
  const data = result[0]?.data || [];

  return { total, data };
};
