import { Module } from "@nestjs/common";
import { AppConfigModule } from "./config/config.module";
import { AppLoggerModule } from "./logger/logger.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [AppConfigModule, AppLoggerModule, PrismaModule],
})
export class AppModule {}
