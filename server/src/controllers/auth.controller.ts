import { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import {
  loginUserService,
  refreshTokenService,
  registerUserService,
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

    const cookieOptions = {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite:
        config.NODE_ENV === "production"
          ? ("strict" as const)
          : ("lax" as const),
    };

    const accessTokenExpiry = ms(
      (config.ACCESS_TOKEN_EXPIRY as StringValue) || "15m"
    );

    const refreshTokenExpiry = ms(
      (config.REFRESH_TOKEN_EXPIRY as StringValue) || "30d"
    );

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: accessTokenExpiry,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
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
    return res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .status(200)
      .json({
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

    const cookieOptions = {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite:
        config.NODE_ENV === "production"
          ? ("strict" as const)
          : ("lax" as const),
    };

    const accessTokenExpiry = ms(
      (config.ACCESS_TOKEN_EXPIRY as StringValue) || "15m"
    );

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: accessTokenExpiry,
    });

    return res.status(200).json({
      message: "Refresh access token successfully",
    });
  } catch (error) {
    next(error);
  }
};
