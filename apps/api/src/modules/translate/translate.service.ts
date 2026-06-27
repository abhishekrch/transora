import { Injectable, Logger, ForbiddenException } from "@nestjs/common";
import { CacheService } from "@/modules/translate/cache.service";
import { AzureTranslatorService } from "@/modules/translate/azure-translator.service";
import { PrismaService } from "@/prisma/prisma.service";
import type { TranslateBatchInput } from "@transora/shared";

export interface TranslateBatchResult {
  translations: string[];
  meta: {
    cacheHits: number;
    azureCalls: number;
    total: number;
  };
}

@Injectable()
export class TranslateService {
  private readonly logger = new Logger(TranslateService.name);

  constructor(
    private readonly cache: CacheService,
    private readonly azure: AzureTranslatorService,
    private readonly prisma: PrismaService,
  ) {}

  async translateBatch(
    input: TranslateBatchInput,
    websiteId: string,
    domain: string,
    allowedLanguages: string[],
  ): Promise<TranslateBatchResult> {
    if (!allowedLanguages.includes(input.targetLang)) {
      throw new ForbiddenException(
        `Language '${input.targetLang}' is not allowed for this website. Allowed: ${allowedLanguages.join(", ")}`,
      );
    }

    const results: string[] = new Array(input.texts.length);
    const toTranslate: { index: number; text: string }[] = [];
    let cacheHits = 0;

    const glossaryEntries = await this.prisma.glossary.findMany({
      where: {
        websiteId,
        sourceText: { in: input.texts },
        targetLang: input.targetLang,
      },
    });

    const glossaryMap = new Map(
      glossaryEntries.map((g) => [g.sourceText, g.translatedText]),
    );

    for (let i = 0; i < input.texts.length; i++) {
      const translation = glossaryMap.get(input.texts[i]!);
      if (translation) {
        results[i] = translation;
        cacheHits++;
      } else {
        toTranslate.push({ index: i, text: input.texts[i]! });
      }
    }

    if (toTranslate.length > 0) {
      const cacheResults = await this.cache.getBatch(
        toTranslate.map((t) => t.text),
        input.targetLang,
        websiteId,
        domain,
      );

      const stillMissing: typeof toTranslate = [];

      cacheResults.forEach((cached, i) => {
        const item = toTranslate[i]!;
        if (cached) {
          results[item.index] = cached;
          cacheHits++;
        } else {
          stillMissing.push(item);
        }
      });

      if (stillMissing.length > 0) {
        const azureResults = await this.azure.translateBatch(
          stillMissing.map((t) => t.text),
          input.targetLang,
          input.sourceLang,
        );

        for (let i = 0; i < stillMissing.length; i++) {
          const item = stillMissing[i]!;
          const azureResult = azureResults[i]!;
          results[item.index] = azureResult;

          this.cache.set(
            item.text,
            input.targetLang,
            domain,
            azureResult,
            input.sourceLang || "auto",
            websiteId,
            input.containsPersonalData || false,
            input.ttlDays,
          ).catch((err) => this.logger.warn(`Cache store failed: ${err}`));
        }
      }
    }

    this.updateStats(websiteId, input, cacheHits, input.texts.length - cacheHits).catch(
      (err) => this.logger.warn(`Stats update failed: ${err}`),
    );

    return {
      translations: results,
      meta: {
        cacheHits,
        azureCalls: input.texts.length - cacheHits,
        total: input.texts.length,
      },
    };
  }

  private async updateStats(
    websiteId: string,
    input: TranslateBatchInput,
    cacheHits: number,
    azureCalls: number,
  ): Promise<void> {
    const today = new Date().toISOString().split("T")[0]!;
    const totalChars = input.texts.reduce((sum, t) => sum + t.length, 0);
    const todayDate = new Date(today);

    await this.prisma.dailyStats.upsert({
      where: {
        websiteId_date: {
          websiteId,
          date: todayDate,
        },
      },
      create: {
        websiteId,
        date: todayDate,
        totalTranslations: input.texts.length,
        cacheHits,
        cacheMisses: azureCalls,
        azureCalls,
        charsTranslated: totalChars,
        uniqueLanguages: [input.targetLang],
      },
      update: {
        totalTranslations: { increment: input.texts.length },
        cacheHits: { increment: cacheHits },
        cacheMisses: { increment: azureCalls },
        azureCalls: { increment: azureCalls },
        charsTranslated: { increment: totalChars },
      },
    });
  }
}
