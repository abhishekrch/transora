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
import { GlossaryModule } from "@/modules/glossary/glossary.module";
import { AuditModule } from "@/modules/audit/audit.module";

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
    GlossaryModule,
    AuditModule,
  ],
})
export class AppModule {}
