import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  MONGODB_URI: z.string().default("mongodb://localhost:27017/smarttask"),
  JWT_ACCESS_SECRET: z.string().default("access-secret-key-smarttask-2026"),
  JWT_REFRESH_SECRET: z.string().default("refresh-secret-key-smarttask-2026"),
  CORS_ORIGIN: z.string().default("http://localhost:3000,https://smarttaskk.vercel.app/"),
  SERVER_URL: z.string().optional(),
  GROK_API_KEY: z.string().optional(),
  XAI_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  API_MAIL_KEY_PROMAILER: z.string().optional(),
  PROMAILER_URL: z.string().default("https://mailserver.automationlounge.com/api/v1/messages/send"),
  EMAIL_FROM: z.string().default("SmartTask Notification <onboarding@resend.dev>"),
  EMAIL_FROM_PROMAILER: z.string().default("SmartTask Notification <[EMAIL_ADDRESS]>"),
  OTP_EXPIRY_MINUTES: z.string().default("10"),
  CRON_EXPRESSION: z.string().default("* * * * *"),
});

export const env = envSchema.parse(process.env);
