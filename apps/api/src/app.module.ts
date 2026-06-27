import { Module } from "@nestjs/common";
import { AppConfigModule } from "@/config/config.module";
import { AppLoggerModule } from "@/logger/logger.module";
import { CommonModule } from "@/common/common.module";
import { PrismaModule } from "@/prisma/prisma.module";
import { AuthModule } from "@/modules/auth/auth.module";
import { WebsiteModule } from "@/modules/website/website.module";

@Module({
  imports: [
    AppConfigModule,
    AppLoggerModule,
    CommonModule,
    PrismaModule,
    AuthModule,
    WebsiteModule,
  ],
})
export class AppModule {}
