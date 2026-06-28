import { SetMetadata } from "@nestjs/common";
import type { AuditAction, AuditResource } from "@transora/shared";

export const AUDIT_KEY = "audit";

export interface AuditOptions {
  action: AuditAction;
  resourceType?: AuditResource;
  captureBody?: boolean;
  captureResponse?: boolean;
}

export const Audit = (options: AuditOptions) => SetMetadata(AUDIT_KEY, options);
