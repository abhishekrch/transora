import { z } from "zod";

const envSchema = z.object({
  // App
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),

  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),

  // Redis
  REDIS_URL: z.string().url("REDIS_URL must be a valid URL"),

  // Azure Translator
  AZURE_TRANSLATOR_KEY: z.string().min(1, "AZURE_TRANSLATOR_KEY is required"),
  AZURE_REGION: z.string().default("global"),

  // Auth
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),

  // Email
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),

  // Dashboard
  DASHBOARD_URL: z.string().url().default("http://localhost:3001"),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `❌ Environment validation failed:\n${errors}\n\n` +
        `Check your .env file and restart the application.`
    );
  }

  return result.data;
}
