import { RewardModel } from "../rewards/reward.model";
import { PayoutModel } from "./payout.model";
import { RewardStatus } from "../rewards/reward.types";
import { AppError } from "../../utils/AppError";
import mongoose from "mongoose";

export const createPayoutService = async (userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Find unpaid rewards
    const rewards = await RewardModel.find({
      user: userId,
      status: RewardStatus.PENDING,
    }).session(session);

    if (rewards.length === 0) {
      throw new AppError("No pending rewards for payout", 400);
    }

    const rewardIds = rewards.map((r) => r._id);
    const totalAmount = rewards.reduce(
      (sum, r) => sum + r.amount,
      0
    );

    // 2. Create payout record
    const payout = await PayoutModel.create(
      [
        {
          user: userId,
          rewardIds,
          totalAmount,
          status: "COMPLETED",
          processedAt: new Date(),
        },
      ],
      { session }
    );

    // 3. Mark rewards as PAID
    await RewardModel.updateMany(
      { _id: { $in: rewardIds } },
      { $set: { status: RewardStatus.PAID } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return payout[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
