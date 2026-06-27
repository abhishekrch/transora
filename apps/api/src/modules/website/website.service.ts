import { Injectable, NotFoundException, ForbiddenException, Logger } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { generateApiKey } from "@/modules/website/utils/api-key";
import type { CreateWebsiteInput, UpdateWebsiteInput } from "@transora/shared";

@Injectable()
export class WebsiteService {
  private readonly logger = new Logger(WebsiteService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.website.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string, userId: string) {
    const website = await this.prisma.website.findUnique({
      where: { id, userId },
    });

    if (!website) {
      throw new NotFoundException("Website not found");
    }

    return website;
  }

  async create(userId: string, input: CreateWebsiteInput) {
    const apiKey = generateApiKey("pk");

    const website = await this.prisma.website.create({
      data: {
        userId,
        domain: input.domain,
        apiKey,
        defaultLanguage: input.defaultLanguage,
        allowedLanguages: input.allowedLanguages,
      },
    });

    this.logger.log(`Website created: ${website.domain} for user ${userId}`);

    return website;
  }

  async update(id: string, userId: string, input: UpdateWebsiteInput) {
    const website = await this.prisma.website.update({
      where: { id, userId },
      data: input,
    });

    this.logger.log(`Website updated: ${website.domain}`);

    return website;
  }

  async remove(id: string, userId: string) {
    await this.prisma.website.delete({
      where: { id, userId },
    });

    this.logger.log(`Website deleted: ${id}`);

    return null;
  }

  async regenerateApiKey(id: string, userId: string) {
    const apiKey = generateApiKey("pk");

    const updated = await this.prisma.website.update({
      where: { id, userId },
      data: { apiKey },
    });

    this.logger.log(`API key regenerated for website: ${updated.domain}`);

    return { apiKey: updated.apiKey };
  }
}
