import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisModule as IoredisModule } from "@nestjs-modules/ioredis";
import { RedisEventService } from "@/redis/redis-event.service";
import type { EnvConfig } from "@/config/env.validation";

@Global()
@Module({
  imports: [
    IoredisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvConfig, true>) => {
        const url = config.get("REDIS_URL", { infer: true });
        const isTls = url.startsWith("rediss://");

        return {
          type: "single",
          url,
          options: {
            tls: isTls ? {} : undefined,

            connectTimeout: 5000,    
            commandTimeout: 3000,    
            enableReadyCheck: true,  
            maxLoadingRetryTime: 10000,

            maxRetriesPerRequest: 3,
            retryStrategy(times: number) {
              return Math.min(200 * Math.pow(2, times), 5000);
            },
          },
        };
      },
    }),
  ],
  providers: [RedisEventService],
  exports: [IoredisModule],
})
export class RedisModule {}
