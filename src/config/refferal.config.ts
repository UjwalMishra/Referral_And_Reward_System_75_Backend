import { UserType } from "../modules/users/user.types";

export const REFERRAL_REWARD_CONFIG: Record<UserType, number> = {
  [UserType.NORMAL]: 100,
  [UserType.OMNI]: 300
};
