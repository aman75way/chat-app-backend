import { BaseSchema } from "../common/dto/base.dto";

export interface UserDTO extends BaseSchema {
  email: string;
  fullName: string;
  profilePic: string | null;
  active: boolean | null;
  role: "ADMIN" | "GADMIN" | "USER";
  gender: "male" | "female";
}
