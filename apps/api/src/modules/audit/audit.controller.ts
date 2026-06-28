import { Controller, Get, Param, Query, UseGuards, ParseUUIDPipe } from "@nestjs/common";
import { PaginationSchema, AuditLogFilterSchema, type PaginationInput, type AuditLogFilterInput } from "@transora/shared";
import { AuditService } from "@/modules/audit/audit.service";
import { ZodQueryPipe } from "@/common/pipes/zod-query.pipe";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { CurrentUser } from "@/modules/auth/decorators/current-user.decorator";

@UseGuards(JwtAuthGuard)
@Controller("audit-log")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  findAll(
    @CurrentUser("id") userId: string,
    @Query(new ZodQueryPipe(PaginationSchema)) pagination: PaginationInput,
    @Query(new ZodQueryPipe(AuditLogFilterSchema)) filters: AuditLogFilterInput,
  ) {
    return this.auditService.findAll(userId, pagination, filters);
  }

  @Get(":id")
  findOne(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.auditService.findOne(id, userId);
  }
}
