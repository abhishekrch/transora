import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { maskSensitiveData } from "@/common/utils/sensitive-fields";
import type { CreateAuditLogInput, AuditLogFilterInput, PaginationInput, PaginatedResponse } from "@transora/shared";
import type { AuditLog, Prisma } from "@prisma/client";

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(
    userId: string | null,
    input: CreateAuditLogInput,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: input.action,
          resourceType: input.resourceType,
          resourceId: input.resourceId,
          outcome: input.outcome || "success",
          metadata: input.metadata
            ? (maskSensitiveData(input.metadata) as Prisma.InputJsonValue)
            : undefined,
          ipAddress,
          userAgent,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${error}`);
    }
  }

  async findAll(
    userId: string,
    pagination: PaginationInput,
    filters?: AuditLogFilterInput,
  ): Promise<PaginatedResponse<AuditLog>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(filters?.action && { action: filters.action }),
      ...(filters?.resourceType && { resourceType: filters.resourceType }),
      ...(filters?.resourceId && { resourceId: filters.resourceId }),
      ...((filters?.startDate || filters?.endDate) && {
        createdAt: {
          ...(filters?.startDate && { gte: new Date(filters.startDate) }),
          ...(filters?.endDate && { lte: new Date(filters.endDate) }),
        },
      }),
    };

    const [entries, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: entries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string): Promise<AuditLog> {
    const entry = await this.prisma.auditLog.findUnique({
      where: { id, userId },
    });

    if (!entry) {
      throw new NotFoundException("Audit log entry not found");
    }

    return entry;
  }
}
