import { z } from "zod";

export const TranslateBatchSchema = z.object({
  texts: z
    .array(z.string().trim().min(1, "Text cannot be empty").max(5000))
    .min(1, "At least one text required")
    .max(100, "Max 100 texts per batch"),
  targetLang: z.string().min(2).max(10),
  sourceLang: z.string().min(2).max(10).optional(),
  containsPersonalData: z.boolean().optional(),
  ttlDays: z.number().min(1).max(365).optional(),
});

export const TranslationSchema = z.object({
  id: z.uuid(),
  websiteId: z.uuid(),
  sourceHash: z.string(),
  sourceText: z.string(),
  sourceLang: z.string(),
  targetLang: z.string(),
  translatedText: z.string(),
  charCount: z.number(),
  isPersonal: z.boolean(),
  expiresAt: z.date().nullable(),
  hitCount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GlossarySchema = z.object({
  id: z.uuid(),
  websiteId: z.uuid(),
  sourceText: z.string(),
  targetLang: z.string(),
  translatedText: z.string(),
  createdAt: z.date(),
});

export const CreateGlossarySchema = z.object({
  sourceText: z.string().trim().min(1, "Source text is required").max(5000),
  targetLang: z.string().min(2).max(10),
  translatedText: z.string().trim().min(1, "Translated text is required").max(5000),
});

export const UpdateGlossarySchema = z.object({
  translatedText: z.string().trim().min(1, "Translated text is required").max(5000),
});

export type TranslateBatchInput = z.infer<typeof TranslateBatchSchema>;
export type Translation = z.infer<typeof TranslationSchema>;
export type Glossary = z.infer<typeof GlossarySchema>;
export type CreateGlossaryInput = z.infer<typeof CreateGlossarySchema>;
export type UpdateGlossaryInput = z.infer<typeof UpdateGlossarySchema>;
