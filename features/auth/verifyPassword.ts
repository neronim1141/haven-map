import bcrypt from "bcrypt";

export const verifyPassword = async (
  hashed: string,
  plain: string
): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};
