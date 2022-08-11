import bcrypt from "bcrypt";

export const createToken = (text: string) => {
  return bcrypt
    .hashSync(text, 1)
    .replace(/[^a-z]/g, "")
    .slice(0, 15);
};
