import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { PrismaModule } from "@/prisma/prisma.module";
import { AuthModule } from "@/modules/auth/auth.module";
import { AuditController } from "@/modules/audit/audit.controller";
import { AuditService } from "@/modules/audit/audit.service";
import { AuditInterceptor } from "@/modules/audit/interceptors/audit.interceptor";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AuditController],
  providers: [
    AuditService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
  exports: [AuditService],
})
export class AuditModule {}
