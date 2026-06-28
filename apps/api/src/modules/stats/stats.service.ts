import {
  Injectable,
  Logger,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import type {
  StatsOverviewInput,
  StatsQueryInput,
} from "@transora/shared";
import type {
  OverviewResult,
  DailyStatsEntry,
  LanguageStatsEntry,
  WebsiteStatsSummary,
  DateRange,
} from "@/modules/stats/interfaces/stats.interfaces";

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getOverview(
    userId: string,
    input: StatsOverviewInput,
  ): Promise<OverviewResult> {
    await this.verifyWebsiteOwnership(input.websiteId, userId);

    const { startDate, endDate } = this.resolvePeriod(input.period);

    const aggregate = await this.prisma.dailyStats.aggregate({
      where: {
        websiteId: input.websiteId,
        date: { gte: startDate, lte: endDate },
      },
      _sum: {
        totalTranslations: true,
        cacheHits: true,
        cacheMisses: true,
        azureCalls: true,
        charsTranslated: true,
      },
    });

    const dailyStats = await this.prisma.dailyStats.findMany({
      where: {
        websiteId: input.websiteId,
        date: { gte: startDate, lte: endDate },
      },
      select: {
        uniqueLanguages: true,
      },
    });

    const uniqueLanguages = [
      ...new Set(dailyStats.flatMap((s) => s.uniqueLanguages)),
    ];

    const sum = aggregate._sum;
    const totalTranslations = sum.totalTranslations ?? 0;
    const cacheHits = sum.cacheHits ?? 0;
    const cacheHitRate =
      totalTranslations > 0
        ? Math.round((cacheHits / totalTranslations) * 100 * 100) / 100
        : 0;

    return {
      totalTranslations,
      cacheHits,
      cacheMisses: sum.cacheMisses ?? 0,
      cacheHitRate,
      azureCalls: sum.azureCalls ?? 0,
      charsTranslated: sum.charsTranslated ?? 0,
      uniqueLanguages,
      period: input.period,
      startDate: startDate.toISOString().split("T")[0]!,
      endDate: endDate.toISOString().split("T")[0]!,
    };
  }

  async getDailyTimeSeries(
    userId: string,
    input: StatsQueryInput,
  ): Promise<DailyStatsEntry[]> {
    await this.verifyWebsiteOwnership(input.websiteId, userId);

    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);

    const rows = await this.prisma.dailyStats.findMany({
      where: {
        websiteId: input.websiteId,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: "asc" },
      select: {
        date: true,
        totalTranslations: true,
        cacheHits: true,
        cacheMisses: true,
        azureCalls: true,
        charsTranslated: true,
      },
    });

    return rows.map((row) => ({
      date: row.date.toISOString().split("T")[0]!,
      totalTranslations: row.totalTranslations,
      cacheHits: row.cacheHits,
      cacheMisses: row.cacheMisses,
      azureCalls: row.azureCalls,
      charsTranslated: row.charsTranslated,
    }));
  }

  async getLanguageBreakdown(
    userId: string,
    input: StatsQueryInput,
  ): Promise<LanguageStatsEntry[]> {
    await this.verifyWebsiteOwnership(input.websiteId, userId);

    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);

    const dailyStats = await this.prisma.dailyStats.findMany({
      where: {
        websiteId: input.websiteId,
        date: { gte: startDate, lte: endDate },
      },
      select: {
        uniqueLanguages: true,
        totalTranslations: true,
      },
    });

    const languageCounts = new Map<string, number>();

    for (const stat of dailyStats) {
      const langCount = stat.uniqueLanguages.length;
      if (langCount === 0) continue;
      const perLang = Math.floor(stat.totalTranslations / langCount);
      for (const lang of stat.uniqueLanguages) {
        languageCounts.set(
          lang,
          (languageCounts.get(lang) ?? 0) + perLang,
        );
      }
    }

    const totalCount = Array.from(languageCounts.values()).reduce(
      (sum, count) => sum + count,
      0,
    );

    return Array.from(languageCounts.entries())
      .map(([language, count]) => ({
        language,
        translationCount: count,
        percentage:
          totalCount > 0
            ? Math.round((count / totalCount) * 100 * 100) / 100
            : 0,
      }))
      .sort((a, b) => b.translationCount - a.translationCount);
  }

  async getWebsiteStatsSummary(
    userId: string,
  ): Promise<WebsiteStatsSummary[]> {
    const websites = await this.prisma.website.findMany({
      where: { userId },
      select: { id: true, domain: true },
    });

    if (websites.length === 0) return [];

    const websiteIds = websites.map((w) => w.id);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await this.prisma.dailyStats.groupBy({
      by: ["websiteId"],
      where: {
        websiteId: { in: websiteIds },
        date: { gte: thirtyDaysAgo },
      },
      _sum: {
        totalTranslations: true,
        cacheHits: true,
        charsTranslated: true,
      },
      _count: { date: true },
    });

    const statsMap = new Map(stats.map((s) => [s.websiteId, s]));

    return websites.map((website) => {
      const s = statsMap.get(website.id);
      const totalTranslations = s?._sum.totalTranslations ?? 0;
      const cacheHits = s?._sum.cacheHits ?? 0;

      return {
        websiteId: website.id,
        domain: website.domain,
        totalTranslations,
        cacheHitRate:
          totalTranslations > 0
            ? Math.round((cacheHits / totalTranslations) * 100 * 100) / 100
            : 0,
        charsTranslated: s?._sum.charsTranslated ?? 0,
        activeDays: s?._count.date ?? 0,
      };
    });
  }

  private async verifyWebsiteOwnership(
    websiteId: string,
    userId: string,
  ): Promise<void> {
    const website = await this.prisma.website.findUnique({
      where: { id: websiteId, userId },
      select: { id: true },
    });
    if (!website) {
      throw new ForbiddenException(
        "Access denied: website not found or not owned by user",
      );
    }
  }

  private resolvePeriod(period: string): DateRange {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case "7d":
        startDate.setUTCDate(endDate.getUTCDate() - 7);
        break;
      case "30d":
        startDate.setUTCDate(endDate.getUTCDate() - 30);
        break;
      case "90d":
        startDate.setUTCDate(endDate.getUTCDate() - 90);
        break;
      case "all":
        startDate.setTime(0);
        break;
      default:
        startDate.setUTCDate(endDate.getUTCDate() - 30);
    }

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    return { startDate, endDate };
  }
}
