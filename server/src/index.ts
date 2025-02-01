import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { config } from "./config/app.config";
import { errorHandler } from "./middlewares/error.middleware";

// routes
import authRoutes from "./routes/auth.route";
import connectDatabase from "./config/database.config";
import userRoutes from "./routes/user.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: config.APP_ORIGIN,
    credentials: true,
  })
);

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      message: "Hello",
    });
  } catch (error) {
    next(error);
  }
});

app.use(`${config.BASE_PATH}/auth`, authRoutes);
app.use(`${config.BASE_PATH}/user`, userRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});
