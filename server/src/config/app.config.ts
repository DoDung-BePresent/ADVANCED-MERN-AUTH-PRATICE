import { getEnv } from "../utils/get-env";

const appConfig = () => {
  const env = getEnv("NODE_ENV", "development");
  return {
    NODE_ENV: env,
    APP_ORIGIN: getEnv("APP_ORIGIN", "localhost"),
    PORT: getEnv("PORT", "5000"),
    BASE_PATH: getEnv("BASE_PATH", "/api/v1"),
    MONGO_URI: getEnv("MONGO_URI"),
    ACCESS_TOKEN_SECRET: getEnv("ACCESS_TOKEN_SECRET"),
    REFRESH_TOKEN_SECRET: getEnv("REFRESH_TOKEN_SECRET"),
    ACCESS_TOKEN_EXPIRY: getEnv("ACCESS_TOKEN_EXPIRY", "15m"),
    REFRESH_TOKEN_EXPIRY: getEnv("REFRESH_TOKEN_EXPIRY", "30d"),
    RESEND_API_KEY: getEnv("RESEND_API_KEY"),
    MAILER_SENDER: getEnv("MAILER_SENDER"),
  };
};

export const config = appConfig();
