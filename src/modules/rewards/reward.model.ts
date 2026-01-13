import { Schema, model, Types } from "mongoose";

export enum RewardStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  PAID = "PAID"
}

export interface IReward {
  user: Types.ObjectId;
  referral: Types.ObjectId;
  amount: number;
  status: RewardStatus;
  createdAt: Date;
  updatedAt: Date;
}

const rewardSchema = new Schema<IReward>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    referral: {
      type: Schema.Types.ObjectId,
      ref: "Referral",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: Object.values(RewardStatus),
      default: RewardStatus.PENDING
    }
  },
  { timestamps: true }
);

export const RewardModel = model<IReward>("Reward", rewardSchema);
