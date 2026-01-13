import { Request, Response } from "express";
import { RewardModel } from "../rewards/reward.model";
import { RewardStatus } from "../rewards/reward.types";
import { createPayoutService } from "./payout.service";

export const createPayout = async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required",
    });
  }

  const payout = await createPayoutService(userId);

  res.json({
    success: true,
    message: "Payout completed successfully",
    payout,
  });
};




export const getPendingPayouts = async (
  req: Request,
  res: Response
) => {
  const data = await RewardModel.aggregate([
    { $match: { status: RewardStatus.PENDING } },
    {
      $group: {
        _id: "$user",
        pendingAmount: { $sum: "$amount" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        userId: "$user._id",
        name: "$user.name",
        email: "$user.email",
        pendingAmount: 1,
      },
    },
  ]);

  res.json({ success: true, data });
};
