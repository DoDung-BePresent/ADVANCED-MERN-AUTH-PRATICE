import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

import UserModel from "../models/user.model";
import { HttpError } from "../utils/HttpError";
import { config } from "../config/app.config";
import VerificationModel from "../models/verification.model";
import { hashValue } from "../utils/bcryptjs";
import { sendEmail } from "../mailers/mailer";
import { passwordResetTemplate } from "../mailers/templates/auth.template";

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

type ForgotPasswordType = {
  email: string;
};

type ResetPasswordType = {
  password: string;
  verificationCode: string;
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

  if (user.userPreferences.enable2FA) {
    return {
      user: null,
      accessToken: "",
      refreshToken: "",
      mfaRequired: true,
    };
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

  const accessToken = jwt.sign({ userId }, config.ACCESS_TOKEN_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY as StringValue,
  });

  return {
    accessToken,
  };
};

export const forgotPasswordService = async ({ email }: ForgotPasswordType) => {
  const user = await UserModel.findOne({
    email,
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const timeAgo = new Date(Date.now() - 3 * 60 * 1000);

  const countTempt = await VerificationModel.countDocuments({
    userId: user._id,
    createdAt: { $gt: timeAgo },
  });

  if (countTempt >= 2) {
    throw new HttpError(429, "Too many request, try again later");
  }

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  const validCode = await VerificationModel.create({
    userId: user._id,
    expiresAt,
  });

  const resetLink = `${config.APP_ORIGIN}/reset-password?code=${
    validCode.code
  }&exp=${expiresAt.getTime()}`;

  const { data, error } = await sendEmail({
    to: user.email,
    ...passwordResetTemplate(resetLink),
  });

  if (!data?.id) {
    throw new HttpError(500, `${error?.name} ${error?.message}`);
  }

  return {
    url: resetLink,
    emailId: data.id,
  };
};

export const resetPasswordService = async ({
  password,
  verificationCode,
}: ResetPasswordType) => {
  const validCode = await VerificationModel.findOne({
    code: verificationCode,
    expiresAt: { $gt: new Date() },
  });

  if (!validCode) {
    throw new HttpError(404, "Invalid or expired verification code");
  }

  const hashedPassword = await hashValue(password);

  const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
    password: hashedPassword,
  });

  if (!updatedUser) {
    throw new HttpError(400, "Failed to reset password");
  }

  await validCode.deleteOne();

  return {
    user: updatedUser,
  };
};
