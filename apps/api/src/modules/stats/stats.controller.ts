import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { StatsService } from "@/modules/stats/stats.service";
import { StatsOverviewSchema, StatsQuerySchema } from "@transora/shared";
import { ZodQueryPipe } from "@/common/pipes/zod-query.pipe";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { CurrentUser } from "@/modules/auth/decorators/current-user.decorator";
import type { StatsOverviewInput, StatsQueryInput } from "@transora/shared";

@Controller("stats")
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get("overview")
  getOverview(
    @CurrentUser("id") userId: string,
    @Query(new ZodQueryPipe(StatsOverviewSchema)) query: StatsOverviewInput,
  ) {
    return this.statsService.getOverview(userId, query);
  }

  @Get("daily")
  getDailyTimeSeries(
    @CurrentUser("id") userId: string,
    @Query(new ZodQueryPipe(StatsQuerySchema)) query: StatsQueryInput,
  ) {
    return this.statsService.getDailyTimeSeries(userId, query);
  }

  @Get("languages")
  getLanguageBreakdown(
    @CurrentUser("id") userId: string,
    @Query(new ZodQueryPipe(StatsQuerySchema)) query: StatsQueryInput,
  ) {
    return this.statsService.getLanguageBreakdown(userId, query);
  }

  @Get("websites")
  getWebsiteStatsSummary(@CurrentUser("id") userId: string) {
    return this.statsService.getWebsiteStatsSummary(userId);
  }
}
