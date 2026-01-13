import { User } from "../users/user.model";

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
    // Optional userType filter early (performance)
    ...(userType
      ? [
          {
            $match: {
              userType,
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
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
              ],
            },
          },
        ]
      : []),

    // LEFT JOIN rewards
    {
      $lookup: {
        from: "rewards",
        localField: "_id",
        foreignField: "user",
        as: "rewards",
      },
    },

    // Calculate totals safely
    {
      $addFields: {
        totalEarnings: {
          $sum: "$rewards.amount",
        },
        totalReferrals: {
          $size: "$rewards",
        },
      },
    },

    // Filter by min earnings
    ...(minEarnings !== undefined
      ? [
          {
            $match: {
              totalEarnings: { $gte: minEarnings },
            },
          },
        ]
      : []),

    // Pagination + count
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
              userId: "$_id",
              name: 1,
              email: 1,
              userType: 1,
              totalReferrals: 1,
              totalEarnings: 1,
            },
          },
        ],
      },
    },
  ];

  const result = await User.aggregate(pipeline);

  const total = result[0]?.metadata[0]?.total || 0;
  const data = result[0]?.data || [];

  return { total, data };
};

