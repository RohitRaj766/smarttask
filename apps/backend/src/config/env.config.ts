import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  MONGODB_URI: z.string().default("mongodb://localhost:27017/smarttask"),
  JWT_ACCESS_SECRET: z.string().default("access-secret-key-smarttask-2026"),
  JWT_REFRESH_SECRET: z.string().default("refresh-secret-key-smarttask-2026"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

export const env = envSchema.parse(process.env);
