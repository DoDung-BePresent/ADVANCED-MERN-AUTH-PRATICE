import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

import UserModel from "../models/user.model";
import { HttpError } from "../utils/HttpError";
import { config } from "../config/app.config";

type RegisterType = {
  name: string;
  email: string;
  password: string;
};

type LoginType = {
  email: string;
  password: string;
};

type RefreshTokenType = {
  refreshToken: string;
};

export const registerUserService = async ({
  name,
  email,
  password,
}: RegisterType) => {
  const existingUser = await UserModel.exists({
    email,
  });

  if (existingUser) {
    throw new HttpError(400, "User already exists with this email");
  }

  const newUser = await UserModel.create({
    name,
    email,
    password,
  });

  return {
    newUser,
  };
};

export const loginUserService = async ({ email, password }: LoginType) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new HttpError(400, "Invalid email or password");
  }

  const accessToken = jwt.sign(
    { userId: user._id },
    config.ACCESS_TOKEN_SECRET,
    {
      expiresIn: config.ACCESS_TOKEN_EXPIRY as StringValue,
    }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: config.REFRESH_TOKEN_EXPIRY as StringValue }
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const refreshTokenService = async ({
  refreshToken,
}: RefreshTokenType) => {
  const { userId } = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET) as {
    userId: string;
  };

  const accessToken = jwt.sign({ userId: userId }, config.ACCESS_TOKEN_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY as StringValue,
  });

  return {
    accessToken,
  };
};

