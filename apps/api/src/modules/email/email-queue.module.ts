import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { ConfigService } from "@nestjs/config";
import type { EnvConfig } from "@/config/env.validation";

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: "email",
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvConfig, true>) => ({
        connection: {
          url: config.get("REDIS_URL", { infer: true }),
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 1000,
          },
          removeOnComplete: {
            age: 7 * 24 * 3600,
            count: 1000,       
          },
          removeOnFail: {
            age: 30 * 24 * 3600, 
            count: 500,           
          },
        },
      }),
    }),
  ],
  exports: [BullModule],
})
export class EmailQueueModule {}
