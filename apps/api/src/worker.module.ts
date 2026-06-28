import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EmailQueueModule } from "@/modules/email/email-queue.module";
import { EmailProcessor } from "@/modules/email/email.processor";
import { validate } from "@/config/env.validation";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
    }),
    EmailQueueModule,
  ],
  providers: [EmailProcessor],
})
export class WorkerModule {}
