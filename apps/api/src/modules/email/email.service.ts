import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { SendEmailSchema, type SendEmailInput } from "@transora/shared";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(@InjectQueue("email") private emailQueue: Queue) {}

  async send(input: SendEmailInput): Promise<void> {
    const validated = SendEmailSchema.parse(input);

    try {
      const job = await this.emailQueue.add(
        "send-email",
        {
          to: validated.to,
          template: validated.template,
          variables: validated.variables,
          userId: validated.userId,
        },
        {
          deduplication: {
            id: `${validated.template}-${validated.to}`,
            ttl: 60000,
          },
        },
      );

      this.logger.log(`Email job queued: ${validated.template} to ${validated.to} (job: ${job.id})`);
    } catch (error) {
      this.logger.error(`Failed to queue email: ${validated.template} to ${validated.to}: ${error}`);
      throw error;
    }
  }
}
