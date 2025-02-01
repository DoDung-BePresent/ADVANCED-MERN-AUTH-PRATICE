import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/HttpError";
import { config } from "../config/app.config";
import UserModel from "../models/user.model";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw new HttpError(401, "Access token not found");
    }

    const { userId } = jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET) as {
      userId: string;
    };

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new HttpError(401, "Invalid or expired token"));
    }
    next(error);
  }
};
