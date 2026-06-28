import { z } from "zod";

export const AuditActionSchema = z.enum([
  "user.register",
  "user.login",
  "user.logout",
  "user.update",
  "user.password_change",
  "website.create",
  "website.update",
  "website.delete",
  "website.key_regenerate",
  "glossary.create",
  "glossary.update",
  "glossary.delete",
  "glossary.delete_all",
  "translate.batch",
  "config.update",
]);

export type AuditAction = z.infer<typeof AuditActionSchema>;

export const AuditResourceSchema = z.enum([
  "user",
  "website",
  "glossary",
  "translation",
  "config",
]);

export type AuditResource = z.infer<typeof AuditResourceSchema>;

export const AuditOutcomeSchema = z.enum(["success", "failure"]);
export type AuditOutcome = z.infer<typeof AuditOutcomeSchema>;

export const CreateAuditLogSchema = z.object({
  action: AuditActionSchema,
  resourceType: AuditResourceSchema.optional(),
  resourceId: z.uuid().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  outcome: AuditOutcomeSchema.default("success"),
});

export type CreateAuditLogInput = z.infer<typeof CreateAuditLogSchema>;

export const AuditLogFilterSchema = z.object({
  action: AuditActionSchema.optional(),
  resourceType: AuditResourceSchema.optional(),
  resourceId: z.uuid().optional(),
  outcome: AuditOutcomeSchema.optional(),
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
});

export type AuditLogFilterInput = z.infer<typeof AuditLogFilterSchema>;
