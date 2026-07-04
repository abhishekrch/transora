import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKey(request);

    if (!apiKey) {
      throw new UnauthorizedException("API key required");
    }

    const website = await this.prisma.website.findUnique({
      where: { apiKey },
      select: {
        id: true,
        userId: true,
        domain: true,
        apiKey: true,
        defaultLanguage: true,
        allowedLanguages: true,
        rateLimitPerMin: true,
        dailyCharLimit: true,
        switcherPosition: true,
        switcherStyle: true,
        seoHreflang: true,
        seoMetaTranslate: true,
        isActive: true,
      },
    });

    if (!website) {
      throw new UnauthorizedException("Invalid API key");
    }

    if (!website.isActive) {
      throw new ForbiddenException("Website is deactivated");
    }

    request.website = website;

    return true;
  }

  private extractApiKey(request: any): string | undefined {
    const headerKey = request.headers?.["x-api-key"] as string | undefined;
    if (headerKey) return headerKey;

    const queryKey = request.query?.["key"] as string | undefined;
    if (queryKey) return queryKey;

    return undefined;
  }
}
