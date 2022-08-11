import { Role } from "@prisma/client";

export type AuthPageOptions = {
  role: Role;
  unauthorized?: string;
};
