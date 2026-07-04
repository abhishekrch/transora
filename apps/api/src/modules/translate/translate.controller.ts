import { Controller, Post, UseGuards, Req, HttpCode, HttpStatus } from "@nestjs/common";
import { TranslateBatchSchema, type TranslateBatchInput } from "@transora/shared";
import { TranslateService } from "./translate.service";
import { ZodBody } from "@/common/decorators/zod-body.decorator";
import { ApiKeyGuard } from "@/common/guards/api-key.guard";
import { DomainWhitelistGuard } from "@/modules/translate/guards/domain-whitelist.guard";
import { RateLimitGuard } from "@/modules/translate/guards/rate-limit.guard";
import type { AuthenticatedRequest } from "@/common/interfaces/website-context.interface";

@Controller("translate")
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Post("batch")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyGuard, DomainWhitelistGuard, RateLimitGuard)
  translateBatch(
    @ZodBody(TranslateBatchSchema) body: TranslateBatchInput,
    @Req() req: AuthenticatedRequest,
  ) {
    const { website } = req;
    return this.translateService.translateBatch(
      body,
      website.id,
      website.domain,
      website.allowedLanguages,
    );
  }
}
