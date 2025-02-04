import { NextFunction, Request, Response } from "express";
import {
  generateMFASetupService,
  verifyMFASetupService,
} from "../services/mfa.service";
import { verifyMfaSchema } from "../validations/mfa.validation";

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
