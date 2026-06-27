import { Module } from "@nestjs/common";
import { AppConfigModule } from "@/config/config.module";
import { AppLoggerModule } from "@/logger/logger.module";
import { RedisModule } from "@/redis/redis.module";
import { CommonModule } from "@/common/common.module";
import { PrismaModule } from "@/prisma/prisma.module";
import { HealthModule } from "@/health/health.module";
import { AuthModule } from "@/modules/auth/auth.module";
import { WebsiteModule } from "@/modules/website/website.module";
import { TranslateModule } from "@/modules/translate/translate.module";

@Module({
  imports: [
    AppConfigModule,
    AppLoggerModule,
    RedisModule,
    CommonModule,
    PrismaModule,
    HealthModule,
    AuthModule,
    WebsiteModule,
    TranslateModule,
  ],
})
export class AppModule {}
