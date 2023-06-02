export function exclude<T, Key extends keyof T>(
  type: T,
  keys: Key[]
): Omit<T, Key> {
  for (let key of keys) {
    delete type[key];
  }
  return type;
}
