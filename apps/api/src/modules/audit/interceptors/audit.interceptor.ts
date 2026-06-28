import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AUDIT_KEY, type AuditOptions } from "@/modules/audit/decorators/audit.decorator";
import { AuditService } from "@/modules/audit/audit.service";

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditOptions = this.reflector.get<AuditOptions>(
      AUDIT_KEY,
      context.getHandler(),
    );

    if (!auditOptions) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id || null;
    const body = request.body;
    const resourceId = request.params?.id;
    const ipAddress = request.ip || null;
    const userAgent = request.headers["user-agent"];

    return next.handle().pipe(
      tap({
        next: (responseBody) => {
          this.auditService.log(
            userId,
            {
              action: auditOptions.action,
              resourceType: auditOptions.resourceType,
              resourceId: resourceId || responseBody?.id,
              metadata: auditOptions.captureBody ? body : undefined,
              outcome: "success",
            },
            ipAddress,
            userAgent,
          );
        },
        error: (_err: unknown) => {
          this.auditService.log(
            userId,
            {
              action: auditOptions.action,
              resourceType: auditOptions.resourceType,
              resourceId,
              metadata: auditOptions.captureBody ? body : undefined,
              outcome: "failure",
            },
            ipAddress,
            userAgent,
          );
        },
      }),
    );
  }
}
