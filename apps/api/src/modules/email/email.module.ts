import { Module } from "@nestjs/common";
import { PrismaModule } from "@/prisma/prisma.module";
import { EmailQueueModule } from "@/modules/email/email-queue.module";
import { EmailService } from "@/modules/email/email.service";

@Module({
  imports: [PrismaModule, EmailQueueModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
