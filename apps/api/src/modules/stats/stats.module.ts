import { Module } from "@nestjs/common";
import { StatsService } from "@/modules/stats/stats.service";
import { StatsController } from "@/modules/stats/stats.controller";

@Module({
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
