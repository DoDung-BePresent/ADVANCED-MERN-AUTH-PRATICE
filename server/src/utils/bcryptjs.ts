import bcryptjs from "bcryptjs";

export const hashValue = async (
  value: string,
  salt: number = 10
): Promise<string> => {
  return await bcryptjs.hash(value, salt);
};

export const compareValue = async (
  value: string,
  hashedValue: string
): Promise<boolean> => {
  return await bcryptjs.compare(value, hashedValue);
};
