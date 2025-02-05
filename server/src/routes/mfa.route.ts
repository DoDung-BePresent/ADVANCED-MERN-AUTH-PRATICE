import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  generateMFASetup,
  revokeMFA,
  verifyMFAForLogin,
  verifyMFASetup,
} from "../controllers/mfa.controller";

const mfaRoutes = Router();

mfaRoutes.get("/setup", authMiddleware, generateMFASetup);
mfaRoutes.post("/verify", authMiddleware, verifyMFASetup);
mfaRoutes.put("/revoke", authMiddleware, revokeMFA);
mfaRoutes.post("/verify-login", verifyMFAForLogin);

export default mfaRoutes;
