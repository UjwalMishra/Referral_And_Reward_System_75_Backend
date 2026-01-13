import { REFERRAL_REWARD_CONFIG } from "../config/refferal.config";
import { UserType } from "../modules/users/user.types";

export const calculateReward = (userType: UserType): number => {
  return REFERRAL_REWARD_CONFIG[userType];
};
