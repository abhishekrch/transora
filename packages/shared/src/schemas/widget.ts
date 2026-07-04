import { z } from "zod";

export const WidgetSettingsSchema = z.object({
  defaultLanguage: z.string(),
  allowedLanguages: z.array(z.string()),
  switcherPosition: z.string(),
  switcherStyle: z.string(),
  seoHreflang: z.boolean(),
  seoMetaTranslate: z.boolean(),
});

export type WidgetSettings = z.infer<typeof WidgetSettingsSchema>;
