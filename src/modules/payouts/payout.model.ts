import { Schema, model, Types } from "mongoose";

export enum PayoutStatus {
  INITIATED = "INITIATED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

export interface IPayout {
  user: Types.ObjectId;
  rewardIds: Types.ObjectId[];
  totalAmount: number;
  status: PayoutStatus;
  processedAt?: Date;
  createdAt: Date;
}

const payoutSchema = new Schema<IPayout>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    rewardIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reward",
        required: true
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(PayoutStatus),
      default: PayoutStatus.INITIATED
    },
    processedAt: {
      type: Date
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const PayoutModel = model<IPayout>("Payout", payoutSchema);
