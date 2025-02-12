import { BaseSchema } from "../common/dto/base.dto";
import { Role, Gender } from "@prisma/client";

export interface UserDTO extends BaseSchema {
  email: string;
  fullName: string;
  profilePic: string | null;
  active: boolean | null;
  role: Role;    // Using the Role enum from Prisma
  gender: Gender; // Using the Gender enum from Prisma
}