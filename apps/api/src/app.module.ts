import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { AppConfigModule } from "@/config/config.module";
import { AppLoggerModule } from "@/logger/logger.module";
import { CommonModule } from "@/common/common.module";
import { PrismaModule } from "@/prisma/prisma.module";
import { AuthModule } from "@/modules/auth/auth.module";
import { WebsiteModule } from "@/modules/website/website.module";
import { SecurityMiddleware } from "@/common/middleware/security.middleware";

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityMiddleware).forRoutes("*");
  }
}
