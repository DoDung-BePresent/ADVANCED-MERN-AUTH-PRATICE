import { Router } from "express";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  resetPassword,
} from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/logout", logoutUser);
authRoutes.post("/password/forgot", forgotPassword);
authRoutes.post("/password/reset", resetPassword);

authRoutes.get("/refresh", refreshToken);

export default authRoutes;
