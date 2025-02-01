import { Router } from "express";
import { getCurrentUser } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const userRoutes = Router();

userRoutes.get("/current", authMiddleware, getCurrentUser);

export default userRoutes;
