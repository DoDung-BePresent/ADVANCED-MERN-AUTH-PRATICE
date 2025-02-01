import UserModel from "../models/user.model";
import { HttpError } from "../utils/HttpError";

export const getCurrentUserService = async (userId: string) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new HttpError(404, "User not found!");
  }

  return { user };
};
