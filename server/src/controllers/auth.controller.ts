import { NextFunction, Request, Response } from "express";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validations/auth.validation";
import {
  forgotPasswordService,
  loginUserService,
  refreshTokenService,
  registerUserService,
  resetPasswordService,
} from "../services/auth.service";
import { config } from "../config/app.config";
import ms from "ms";
import type { StringValue } from "ms";
import { HttpError } from "../utils/HttpError";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = registerSchema.parse(req.body);

    const { newUser } = await registerUserService(body);

    return res.status(201).json({
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = loginSchema.parse(req.body);

    const { user, accessToken, refreshToken } = await loginUserService(body);

    // const cookieOptions = {
    //   httpOnly: true,
    //   secure: config.NODE_ENV === "production",
    //   sameSite:
    //     config.NODE_ENV === "production"
    //       ? ("strict" as const)
    //       : ("lax" as const),
    //       path: "/"
    // };

    const accessTokenExpiry = ms(
      (config.ACCESS_TOKEN_EXPIRY as StringValue) || "15m"
    );

    const refreshTokenExpiry = ms(
      (config.REFRESH_TOKEN_EXPIRY as StringValue) || "30d"
    );

    // res.cookie("accessToken", accessToken, {
    //   ...cookieOptions,
    //   maxAge: accessTokenExpiry,
    // });

    // res.cookie("refreshToken", refreshToken, {
    //   ...cookieOptions,
    //   maxAge: refreshTokenExpiry,
    // });

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

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      path: `${config.BASE_PATH}/auth/refresh`,
    });

    return res.status(200).json({
      message: "User logout successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new HttpError(401, "Missing refresh token");
    }

    const { accessToken } = await refreshTokenService({ refreshToken });

    const accessTokenExpiry = ms(
      (config.ACCESS_TOKEN_EXPIRY as StringValue) || "15m"
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax", // hoặc "none" trong production với HTTPS
      path: "/", // Đảm bảo cookie available cho toàn bộ domain
      maxAge: accessTokenExpiry,
    });

    return res.status(200).json({
      message: "Refresh access token successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = emailSchema.parse(req.body.email);

    await forgotPasswordService({ email });

    return res.status(200).json({
      message: "Password reset email sent",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = resetPasswordSchema.parse(req.body);

    const { user } = await resetPasswordService(body);

    return res.status(200).json({
      message: "Reset password successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
