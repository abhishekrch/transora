import { Controller, Post, UseGuards, Req, HttpCode, HttpStatus } from "@nestjs/common";
import { TranslateBatchSchema, type TranslateBatchInput } from "@transora/shared";
import { TranslateService } from "./translate.service";
import { ZodBody } from "@/common/decorators/zod-body.decorator";
import { ApiKeyGuard } from "./guards/api-key.guard";
import { DomainWhitelistGuard } from "./guards/domain-whitelist.guard";
import { RateLimitGuard } from "./guards/rate-limit.guard";
import type { TranslateRequest } from "./interfaces/translate-request.interface";

@Controller("translate")
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Post("batch")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyGuard, DomainWhitelistGuard, RateLimitGuard)
  translateBatch(
    @ZodBody(TranslateBatchSchema) body: TranslateBatchInput,
    @Req() req: TranslateRequest,
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
