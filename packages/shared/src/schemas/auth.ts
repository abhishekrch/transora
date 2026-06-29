import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long"),
  companyName: z.string().min(1).max(255).optional(),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const AuthTokensSchema = z.object({
  accessToken: z.string(),
});

export const AuthResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    companyName: z.string().nullable(),
  }),
  accessToken: z.string(),
});

export const ApiErrorSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  error: z.string(),
  details: z
    .array(z.object({ field: z.string(), message: z.string() }))
    .optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type AuthTokens = z.infer<typeof AuthTokensSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
