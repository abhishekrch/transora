import { z } from "zod";

export const EmailTemplateSchema = z.enum([
  "welcome",
  "password-reset",
  "api-key-regenerated",
  "usage-alert",
]);

export type EmailTemplate = z.infer<typeof EmailTemplateSchema>;

export const SendEmailSchema = z.object({
  to: z.email("Invalid email address"),
  template: EmailTemplateSchema,
  variables: z.record(z.string(), z.unknown()).optional(),
  userId: z.uuid().optional(),
});

export type SendEmailInput = z.infer<typeof SendEmailSchema>;

export const EmailLogSchema = z.object({
  id: z.uuid(),
  to: z.email(),
  template: EmailTemplateSchema,
  subject: z.string(),
  status: z.enum(["sent", "failed", "pending"]),
  resendId: z.string().nullable(),
  error: z.string().nullable(),
  createdAt: z.date(),
});

export type EmailLog = z.infer<typeof EmailLogSchema>;
