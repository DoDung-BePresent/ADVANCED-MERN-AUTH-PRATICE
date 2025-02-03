import { NextFunction, Request, Response } from "express";
import { getCurrentUserService } from "../services/user.service";

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id?.toString();

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const { user } = await getCurrentUserService(userId);

    return res.status(200).json({
      message: "User fetch successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
