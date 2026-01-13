export enum RewardStatus {
  PENDING = "PENDING",
  PAID = "PAID",
}

export interface RewardSummary {
  userId: string;
  totalEarnings: number;
  totalReferrals: number;
}
