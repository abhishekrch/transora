import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import type { Redis } from "ioredis";


@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RateLimitGuard.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const website = request.website;

    if (!website) {
      return true;
    }

    const apiKey = website.apiKey;

    await this.checkRateLimit(apiKey, website.rateLimitPerMin);

    const body = request.body;
    if (body?.texts) {
      const totalChars = body.texts.reduce((sum: number, t: string) => sum + t.length, 0);
      await this.checkDailyCap(apiKey, totalChars, website.dailyCharLimit);
    }

    return true;
  }

  private async checkRateLimit(apiKey: string, limit: number): Promise<void> {
    const key = `rate:${apiKey}`;
    const windowSeconds = 60;

    const results = await this.redis
      .pipeline()
      .incr(key)
      .expire(key, windowSeconds)
      .exec();

    const current = (results?.[0]?.[1] as number) ?? 0;

    if (current > limit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: "Rate limit exceeded",
          error: "TOO_MANY_REQUESTS",
          retryAfter: windowSeconds,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  private async checkDailyCap(
    apiKey: string,
    chars: number,
    limit: number,
  ): Promise<void> {
    const today = new Date().toISOString().split("T")[0]!;
    const key = `daily:${apiKey}:${today}`;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const ttlSeconds = Math.ceil((tomorrow.getTime() - Date.now()) / 1000);

    const results = await this.redis
      .pipeline()
      .incrby(key, chars)
      .expire(key, ttlSeconds)
      .exec();

    const current = (results?.[0]?.[1] as number) ?? 0;

    if (current > limit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: "Daily character limit exceeded",
          error: "DAILY_LIMIT_EXCEEDED",
          limit,
          used: current,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
}
