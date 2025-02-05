import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

import { Request } from "express";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { HttpError } from "../utils/HttpError";
import UserModel from "../models/user.model";
import { config } from "../config/app.config";

export const generateMFASetupService = async (req: Request) => {
  const user = req.user;

  if (!user) {
    throw new HttpError(401, "User not authorized");
  }

  if (user.userPreferences.enable2FA) {
    throw new HttpError(400, "MFA already enabled");
  }

  let secretKey = user.userPreferences.twoFactorSecret;

  if (!secretKey) {
    const secret = speakeasy.generateSecret({
      length: 20,
      name: `MyApp (Squeezy.com - practice)`,
    });
    secretKey = secret.base32;
    user.userPreferences.twoFactorSecret = secretKey;
    await user.save();
  }

  const url = speakeasy.otpauthURL({
    secret: secretKey, //🔑 Chuỗi bí mật (Secret Key) dùng để tạo mã OTP. Phải ở dạng Base32.
    label: `${user.email}`, // 🏷️ Tên tài khoản hoặc user. Hiển thị trong ứng dụng xác thực (Google Authenticator).
    issuer: "squeezy.com", // 🏢 Tên ứng dụng hoặc tổ chức. Dùng để phân biệt các ứng dụng khác nhau.
    encoding: "base32", // 🔡 Kiểu mã hóa secret ("base32", "hex", "ascii"). Mặc định nên dùng "base32" để tương thích với Google Authenticator.
  });

  const qrCodeUrl = await qrcode.toDataURL(url);

  return {
    secretKey,
    qrCodeUrl,
  };
};

export const verifyMFASetupService = async (
  req: Request,
  code: string,
  secretKey: string
) => {
  const user = req.user;

  if (!user) {
    throw new HttpError(401, "User not authorized");
  }

  if (user.userPreferences.enable2FA) {
    throw new HttpError(400, "MFA is already enabled");
  }

  const isValid = speakeasy.totp.verify({
    secret: secretKey,
    encoding: "base32",
    token: code,
  });

  if (!isValid) {
    throw new HttpError(400, "Invalid MFA code. Please try again.");
  }

  user.userPreferences.enable2FA = true;
  await user.save();

  return {
    userPreferences: {
      enable2FA: user.userPreferences.enable2FA,
    },
  };
};

export const verifyMFAForLoginService = async (code: string, email: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  if (
    !user.userPreferences.enable2FA ||
    !user.userPreferences.twoFactorSecret
  ) {
    throw new HttpError(401, "MFA not enabled for this user");
  }

  const isValid = speakeasy.totp.verify({
    secret: user.userPreferences.twoFactorSecret,
    encoding: "base32",
    token: code,
  });

  if (!isValid) {
    throw new HttpError(400, "Invalid MFA code. Please try again.");
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

export const revokeMFAService = async (req: Request) => {
  const user = req.user;

  if (!user) {
    throw new HttpError(401, "User not authorized");
  }

  if (!user.userPreferences.enable2FA) {
    throw new HttpError(400, "MFA is not enabled");
  }

  user.userPreferences.twoFactorSecret = undefined;
  user.userPreferences.enable2FA = false;
  await user.save();

  return {
    userPreferences: {
      enable2FA: user.userPreferences.enable2FA,
    },
  };
};
