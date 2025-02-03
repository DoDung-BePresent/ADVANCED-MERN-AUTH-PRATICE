import { Request } from "express";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { HttpError } from "../utils/HttpError";

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
    label: `${user.name}`, // 🏷️ Tên tài khoản hoặc user. Hiển thị trong ứng dụng xác thực (Google Authenticator).
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
