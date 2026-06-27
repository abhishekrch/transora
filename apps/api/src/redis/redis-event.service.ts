import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import type { Redis } from "ioredis";

@Injectable()
export class RedisEventService implements OnModuleInit {
  private readonly logger = new Logger(RedisEventService.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

  onModuleInit() {
    this.redis.on("error", (err) => {
      this.logger.error(`Redis error: ${err.message}`);
    });

    this.redis.on("connect", () => {
      this.logger.log("Redis connected");
    });

    this.redis.on("ready", () => {
      this.logger.log("Redis ready");
    });

    this.redis.on("reconnecting", (delay: number) => {
      this.logger.warn(`Redis reconnecting in ${delay}ms`);
    });

    this.redis.on("end", () => {
      this.logger.warn("Redis connection ended");
    });
  }
}
