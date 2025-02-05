import { NextFunction, Request, Response } from "express";
import ms from "ms";
import type { StringValue } from "ms";
import {
  generateMFASetupService,
  verifyMFAForLoginService,
  verifyMFASetupService,
} from "../services/mfa.service";
import {
  verifyMfaForLoginSchema,
  verifyMfaSchema,
} from "../validations/mfa.validation";
import { config } from "../config/app.config";

export const generateMFASetup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { secretKey, qrCodeUrl } = await generateMFASetupService(req);

    return res.status(201).json({
      message: "Scan the QR code or use the setup key.",
      secretKey,
      qrCodeUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyMFASetup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code, secretKey } = verifyMfaSchema.parse(req.body);
    await verifyMFASetupService(req, code, secretKey);

    return res.status(200).json({
      message: "MFA setup completed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyMFAForLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code, email } = verifyMfaForLoginSchema.parse(req.body);

    const { user, accessToken, refreshToken } = await verifyMFAForLoginService(
      code,
      email
    );

    const accessTokenExpiry = ms(
      (config.ACCESS_TOKEN_EXPIRY as StringValue) || "15m"
    );

    const refreshTokenExpiry = ms(
      (config.REFRESH_TOKEN_EXPIRY as StringValue) || "30d"
    );

    // Set cookie với đầy đủ options
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax", // Hoặc "none" trong production
      path: "/", // Đảm bảo cookie available cho toàn bộ domain
      maxAge: accessTokenExpiry,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      path: `${config.BASE_PATH}/auth/refresh`, // Path specific cho refresh route
      maxAge: refreshTokenExpiry,
    });

    return res.status(200).json({
      message: "Login successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
