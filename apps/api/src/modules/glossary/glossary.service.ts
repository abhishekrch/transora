import { Injectable, ForbiddenException, BadRequestException, Logger } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import type { CreateGlossaryInput, UpdateGlossaryInput, PaginationInput, PaginatedResponse, Glossary } from "@transora/shared";

@Injectable()
export class GlossaryService {
  private readonly logger = new Logger(GlossaryService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async verifyOwnership(websiteId: string, userId: string): Promise<void> {
    const website = await this.prisma.website.findUnique({
      where: { id: websiteId, userId },
      select: { id: true },
    });

    if (!website) {
      throw new ForbiddenException("Access denied: website not found or not owned by user");
    }
  }

  async findAll(
    websiteId: string,
    userId: string,
    pagination: PaginationInput,
  ): Promise<PaginatedResponse<Glossary>> {
    await this.verifyOwnership(websiteId, userId);

    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
      this.prisma.glossary.findMany({
        where: { websiteId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.glossary.count({ where: { websiteId } }),
    ]);

    return {
      data: entries as Glossary[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(websiteId: string, userId: string, input: CreateGlossaryInput): Promise<Glossary> {
    await this.verifyOwnership(websiteId, userId);

    const entry = await this.prisma.glossary.upsert({
      where: {
        websiteId_sourceText_targetLang: {
          websiteId,
          sourceText: input.sourceText,
          targetLang: input.targetLang,
        },
      },
      create: {
        websiteId,
        sourceText: input.sourceText,
        targetLang: input.targetLang,
        translatedText: input.translatedText,
      },
      update: {
        translatedText: input.translatedText,
      },
    });

    this.logger.log(`Glossary entry created/updated: ${entry.id}`);

    return entry as Glossary;
  }

  async update(id: string, websiteId: string, userId: string, input: UpdateGlossaryInput): Promise<Glossary> {
    await this.verifyOwnership(websiteId, userId);

    const updated = await this.prisma.glossary.update({
      where: { id, websiteId },
      data: { translatedText: input.translatedText },
    });

    this.logger.log(`Glossary entry updated: ${id}`);

    return updated as Glossary;
  }

  async remove(id: string, websiteId: string, userId: string): Promise<void> {
    await this.verifyOwnership(websiteId, userId);

    await this.prisma.glossary.delete({
      where: { id, websiteId },
    });

    this.logger.log(`Glossary entry deleted: ${id}`);
  }

  async removeAll(websiteId: string, userId: string, confirm: boolean = false): Promise<{ deleted: number }> {
    if (!confirm) {
      throw new BadRequestException(
        "Bulk delete requires confirm=true to prevent accidental deletion",
      );
    }

    await this.verifyOwnership(websiteId, userId);

    const result = await this.prisma.glossary.deleteMany({
      where: { websiteId },
    });

    this.logger.log(`Glossary cleared: ${result.count} entries deleted`);

    return { deleted: result.count };
  }
}
