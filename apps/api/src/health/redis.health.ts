import { Injectable } from "@nestjs/common";
import { HealthIndicatorService } from "@nestjs/terminus";
import { InjectRedis } from "@nestjs-modules/ioredis";
import type { Redis } from "ioredis";

@Injectable()
export class RedisHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async isHealthy(key: string) {
    try {
      await this.redis.ping();
      return this.healthIndicatorService.check(key).up();
    } catch (error) {
      return this.healthIndicatorService.check(key).down({
        message: (error as Error).message,
      });
    }
  }
}
