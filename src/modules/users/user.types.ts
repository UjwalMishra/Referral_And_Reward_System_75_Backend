import { Role } from "../../constants/roles.constants";

export enum UserType {
  NORMAL = "NORMAL",
  OMNI = "OMNI",
}

export interface AuthUser {
  id: string;
  userType: UserType;
  role: Role;
}
