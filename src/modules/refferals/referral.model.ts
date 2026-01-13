import { Schema, model, Types } from "mongoose";
import { UserType } from "../users/user.types";

export interface IReferral {
  inviter: Types.ObjectId;
  invitedUser: Types.ObjectId;
  invitedUserType: UserType;
  createdAt: Date;
}

const referralSchema = new Schema<IReferral>(
  {
    inviter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    invitedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    invitedUserType: {
      type: String,
      enum: Object.values(UserType),
      required: true
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ReferralModel = model<IReferral>("Referral", referralSchema);
