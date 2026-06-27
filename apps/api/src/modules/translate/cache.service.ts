import { Injectable, Logger } from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import type { Redis } from "ioredis";
import { createHash } from "crypto";
import { REDIS_TTL_SECONDS, PERSONAL_DATA_TTL_DAYS } from "@transora/shared";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  private hashText(text: string): string {
    return createHash("sha256").update(text).digest("hex").substring(0, 64);
  }

  private redisKey(hash: string, targetLang: string, domain: string): string {
    return `trans:${hash}:${targetLang}:${domain}`;
  }

  async get(
    text: string,
    targetLang: string,
    websiteId: string,
    domain: string,
  ): Promise<string | null> {
    const hash = this.hashText(text);
    const key = this.redisKey(hash, targetLang, domain);

    const cached = await this.redis.get(key);
    if (cached) {
      await this.incrementHitCount(hash, targetLang, websiteId);
      return cached;
    }

    const stored = await this.prisma.translation.findUnique({
      where: {
        websiteId_sourceHash_targetLang: {
          websiteId,
          sourceHash: hash,
          targetLang,
        },
      },
    });

    if (stored && (!stored.expiresAt || stored.expiresAt > new Date())) {
      await this.redis.setex(key, REDIS_TTL_SECONDS, stored.translatedText);
      await this.incrementHitCount(hash, targetLang, websiteId);
      return stored.translatedText;
    }

    return null;
  }

  async getBatch(
    texts: string[],
    targetLang: string,
    websiteId: string,
    domain: string,
  ): Promise<(string | null)[]> {
    const hashes = texts.map((t) => this.hashText(t));
    const keys = hashes.map((h) => this.redisKey(h, targetLang, domain));

    const cached = await this.redis.mget(keys);

    const results: (string | null)[] = new Array(texts.length);
    const missIndices: number[] = [];

    cached.forEach((val: string | null, i: number) => {
      if (val) {
        results[i] = val;
      } else {
        missIndices.push(i);
      }
    });

    if (missIndices.length > 0) {
      const missHashes = missIndices.map((i) => hashes[i]!);
      const stored = await this.prisma.translation.findMany({
        where: {
          websiteId,
          sourceHash: { in: missHashes },
          targetLang,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
      });

      const storedMap = new Map(stored.map((t) => [t.sourceHash, t.translatedText]));

      for (const i of missIndices) {
        const translation = storedMap.get(hashes[i]!);
        if (translation) {
          results[i] = translation;
          await this.redis.setex(keys[i]!, REDIS_TTL_SECONDS, translation);
        }
      }
    }

    return results;
  }

  async set(
    text: string,
    targetLang: string,
    domain: string,
    translatedText: string,
    sourceLang: string,
    websiteId: string,
    isPersonal: boolean,
    ttlDays?: number,
  ): Promise<void> {
    const hash = this.hashText(text);
    const key = this.redisKey(hash, targetLang, domain);

    const effectiveTtl = ttlDays ?? (isPersonal ? PERSONAL_DATA_TTL_DAYS : null);
    const expiresAt = effectiveTtl
      ? new Date(Date.now() + effectiveTtl * 24 * 60 * 60 * 1000)
      : null;

    await this.redis.setex(key, REDIS_TTL_SECONDS, translatedText);

    await this.prisma.translation.upsert({
      where: {
        websiteId_sourceHash_targetLang: {
          websiteId,
          sourceHash: hash,
          targetLang,
        },
      },
      create: {
        websiteId,
        sourceHash: hash,
        sourceText: text,
        sourceLang,
        targetLang,
        translatedText,
        charCount: text.length,
        isPersonal,
        expiresAt,
      },
      update: {
        translatedText,
        updatedAt: new Date(),
      },
    });
  }

  async setBatch(
    texts: string[],
    targetLang: string,
    domain: string,
    translations: string[],
    sourceLang: string,
    websiteId: string,
    isPersonal: boolean,
    ttlDays?: number,
  ): Promise<void> {
    const hashes = texts.map((t) => this.hashText(t));

    const pipe = this.redis.pipeline();
    for (let i = 0; i < texts.length; i++) {
      const key = this.redisKey(hashes[i]!, targetLang, domain);
      pipe.setex(key, REDIS_TTL_SECONDS, translations[i]!);
    }
    await pipe.exec();

    const effectiveTtl = ttlDays ?? (isPersonal ? PERSONAL_DATA_TTL_DAYS : null);
    const expiresAt = effectiveTtl
      ? new Date(Date.now() + effectiveTtl * 24 * 60 * 60 * 1000)
      : null;

    for (let i = 0; i < texts.length; i++) {
      await this.prisma.translation.upsert({
        where: {
          websiteId_sourceHash_targetLang: {
            websiteId,
            sourceHash: hashes[i]!,
            targetLang,
          },
        },
        create: {
          websiteId,
          sourceHash: hashes[i]!,
          sourceText: texts[i]!,
          sourceLang,
          targetLang,
          translatedText: translations[i]!,
          charCount: texts[i]!.length,
          isPersonal,
          expiresAt,
        },
        update: {
          translatedText: translations[i]!,
          updatedAt: new Date(),
        },
      });
    }
  }

  private async incrementHitCount(
    hash: string,
    targetLang: string,
    websiteId: string,
  ): Promise<void> {
    try {
      await this.prisma.translation.updateMany({
        where: {
          sourceHash: hash,
          targetLang,
          websiteId,
        },
        data: {
          hitCount: { increment: 1 },
        },
      });
    } catch (error) {
      this.logger.warn(`Failed to increment hit count: ${error}`);
    }
  }
}
