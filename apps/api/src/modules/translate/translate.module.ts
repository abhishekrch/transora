import { Module } from "@nestjs/common";
import { PrismaModule } from "@/prisma/prisma.module";
import { TranslateController } from "@/modules/translate/translate.controller";
import { TranslateService } from "@/modules/translate/translate.service";
import { AzureTranslatorService } from "@/modules/translate/azure-translator.service";
import { CacheService } from "@/modules/translate/cache.service";
import { ApiKeyGuard } from "@/modules/translate/guards/api-key.guard";
import { DomainWhitelistGuard } from "@/modules/translate/guards/domain-whitelist.guard";
import { RateLimitGuard } from "@/modules/translate/guards/rate-limit.guard";

@Module({
  imports: [PrismaModule],
  controllers: [TranslateController],
  providers: [
    TranslateService,
    AzureTranslatorService,
    CacheService,
    ApiKeyGuard,
    DomainWhitelistGuard,
    RateLimitGuard,
  ],
  exports: [TranslateService],
})
export class TranslateModule {}
