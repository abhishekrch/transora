import { z } from "zod";

export const CreateWebsiteSchema = z.object({
  domain: z
    .string()
    .min(1, "Domain is required")
    .max(255)
    .regex(
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
      "Invalid domain format"
    ),
  defaultLanguage: z.string().min(2).max(10).default("en"),
  allowedLanguages: z
    .array(z.string().min(2).max(10))
    .min(1, "At least one language required")
    .max(50),
});

export const UpdateWebsiteSchema = z.object({
  domain: z.string().min(1).max(255).optional(),
  defaultLanguage: z.string().min(2).max(10).optional(),
  allowedLanguages: z
    .array(z.string().min(2).max(10))
    .min(1)
    .max(50)
    .optional(),
  switcherPosition: z
    .enum(["top-left", "top-right", "bottom-left", "bottom-right"])
    .optional(),
  switcherStyle: z.enum(["dropdown", "flags"]).optional(),
  seoHreflang: z.boolean().optional(),
  seoMetaTranslate: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const WebsiteSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  domain: z.string(),
  apiKey: z.string(),
  defaultLanguage: z.string(),
  allowedLanguages: z.array(z.string()),
  rateLimitPerMin: z.number(),
  dailyCharLimit: z.number(),
  switcherPosition: z.string(),
  switcherStyle: z.string(),
  seoHreflang: z.boolean(),
  seoMetaTranslate: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateWebsiteInput = z.infer<typeof CreateWebsiteSchema>;
export type UpdateWebsiteInput = z.infer<typeof UpdateWebsiteSchema>;
export type Website = z.infer<typeof WebsiteSchema>;
