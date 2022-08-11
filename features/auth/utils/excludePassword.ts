export function excludeFields<T, Key extends keyof T>(
  user: T,
  ...keys: Key[]
): Omit<T, Key> {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}
