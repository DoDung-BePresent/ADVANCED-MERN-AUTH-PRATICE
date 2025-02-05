import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  generateMFASetup,
  verifyMFAForLogin,
  verifyMFASetup,
} from "../controllers/mfa.controller";

const mfaRoutes = Router();

mfaRoutes.get("/setup", authMiddleware, generateMFASetup);
mfaRoutes.post("/verify", authMiddleware, verifyMFASetup);
mfaRoutes.put("/revoke", authMiddleware, () => {});
mfaRoutes.post("/verify-login", verifyMFAForLogin);

export default mfaRoutes;
