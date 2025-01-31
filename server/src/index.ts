import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";

import { config } from "./config/app.config";
import { errorHandler } from "./middlewares/error.middleware";

// routes
import authRoutes from "./routes/auth.route";
import connectDatabase from "./config/database.config";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});
