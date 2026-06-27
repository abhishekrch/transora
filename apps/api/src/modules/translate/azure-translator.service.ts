import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { z } from "zod";
import { AZURE_MAX_RETRIES, AZURE_TIMEOUT_MS } from "@transora/shared";
import type { EnvConfig } from "@/config/env.validation";

const AzureTranslationSchema = z.array(
  z.object({
    translations: z
      .array(
        z.object({
          text: z.string(),
          to: z.string(),
        })
      )
      .min(1, "Azure response missing translations"),
  })
);

@Injectable()
export class AzureTranslatorService implements OnModuleInit {
  private readonly logger = new Logger(AzureTranslatorService.name);
  private apiKey: string;
  private region: string;
  private readonly endpoint = "https://api.cognitive.microsofttranslator.com";

  constructor(private readonly config: ConfigService<EnvConfig, true>) {}

  onModuleInit() {
    this.apiKey = this.config.get("AZURE_TRANSLATOR_KEY", { infer: true });
    this.region = this.config.get("AZURE_REGION", { infer: true });
  }

  async translate(text: string, targetLang: string, sourceLang?: string): Promise<string> {
    const results = await this.translateBatch([text], targetLang, sourceLang);
    return results[0]!;
  }

  async translateBatch(
    texts: string[],
    targetLang: string,
    sourceLang?: string,
  ): Promise<string[]> {
    if (texts.length === 0) return [];

    const url = new URL(`${this.endpoint}/translate`);
    url.searchParams.set("api-version", "3.0");
    url.searchParams.set("to", targetLang);
    if (sourceLang) {
      url.searchParams.set("from", sourceLang);
    }

    const body = texts.map((text) => ({ Text: text }));
    const bodyStr = JSON.stringify(body);

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= AZURE_MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), AZURE_TIMEOUT_MS);

      try {
        const response = await fetch(url.toString(), {
          method: "POST",
          headers: {
            "Ocp-Apim-Subscription-Key": this.apiKey,
            "Ocp-Apim-Subscription-Region": this.region,
            "Content-Type": "application/json",
          },
          body: bodyStr,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const rawData = await response.json();

          const result = AzureTranslationSchema.safeParse(rawData);
          if (!result.success) {
            this.logger.error(`Invalid Azure response: ${result.error.message}`);
            throw new Error("Invalid Azure Translator response format");
          }

          return result.data.map((item) => item.translations[0]!.text);
        }

        if (response.status === 429 || response.status >= 500) {
          lastError = new Error(`Azure error: ${response.status}`);
          this.logger.warn(`Azure retry ${attempt + 1}/${AZURE_MAX_RETRIES}: ${response.status}`);

          if (attempt < AZURE_MAX_RETRIES) {
            const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
            await this.sleep(delay);
            continue;
          }
        }

        const errorText = await response.text();
        this.logger.error(`Azure Translator error: ${response.status} - ${errorText}`);
        throw new Error(`Azure Translator error: ${response.status}`);
      } catch (err) {
        clearTimeout(timeoutId);

        if (err instanceof Error && err.name === "AbortError") {
          lastError = new Error(`Azure request timed out after ${AZURE_TIMEOUT_MS}ms`);
          this.logger.warn(`Azure timeout ${attempt + 1}/${AZURE_MAX_RETRIES}`);

          if (attempt < AZURE_MAX_RETRIES) {
            const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
            await this.sleep(delay);
            continue;
          }
        }

        if (attempt === AZURE_MAX_RETRIES) {
          throw lastError || err;
        }
      }
    }

    throw lastError || new Error("Azure Translator failed after all retries");
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
