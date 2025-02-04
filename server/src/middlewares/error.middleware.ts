import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/HttpError";
import { z } from "zod";
import { config } from "../config/app.config";

const formatZodError = (res: Response, error: z.ZodError) => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
  return res.status(400).json({
    message: "Validation failed",
    errors: errors,
  });
};

const REFRESH_PATH = `${config.BASE_PATH}/auth/refresh`;

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(`Error occurred on PATH: ${req.path}`, err);

  if (req.path === REFRESH_PATH) {
    res
      .clearCookie("accessToken", { path: "/" })
      .clearCookie("refreshToken", { path: REFRESH_PATH });
  }

  if (err instanceof SyntaxError) {
    return res.status(400).json({
      message: "Invalid JSON format, please check your request body",
    });
  }

  if (err instanceof z.ZodError) {
    return formatZodError(res, err);
  }

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: "Internal Server Error",
  });
};
