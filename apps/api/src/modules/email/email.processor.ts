import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { ConfigService } from "@nestjs/config";
import { escapeHtml } from "@/common/utils/escape-html";
import { Resend } from "resend";
import { TEMPLATE_CONFIG } from "@/modules/email/templates/template-config";
import type { EnvConfig } from "@/config/env.validation";
import type { EmailTemplate, SendEmailInput } from "@transora/shared";
import * as fs from "fs";
import * as path from "path";

@Processor("email")
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);
  private resend: Resend | null = null;

  constructor(private readonly config: ConfigService<EnvConfig, true>) {
    super();
  }

  async process(job: Job<SendEmailInput>): Promise<void> {
    const { to, template, variables, userId } = job.data;

    try {
      if (!this.resend) {
        this.resend = new Resend(this.config.get("RESEND_API_KEY", { infer: true }));
      }

      const { subject, html } = this.renderTemplate(template, variables);

      const { data, error } = await this.resend.emails.send(
        {
          from: this.config.get("EMAIL_FROM_ADDRESS", { infer: true }),
          to: [to],
          subject,
          html,
          tags: [
            { name: "template", value: template },
            { name: "user_id", value: userId || "unknown" },
            { name: "job_id", value: job.id || "unknown" },
          ],
        },
        {
          idempotencyKey: `${template}-${to}-${job.id}`,
        },
      );

      if (error) {
        throw new Error(error.message);
      }

      this.logger.log(`Email sent: ${template} to ${to} (job: ${job.id})`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${template} to ${to}: ${error}`);
      throw error;
    }
  }

  @OnWorkerEvent("completed")
  onCompleted(job: Job<SendEmailInput>) {
    this.logger.log(`Email job completed: ${job.id}`);
  }

  @OnWorkerEvent("failed")
  onFailed(job: Job<SendEmailInput>, error: Error) {
    this.logger.error(`Email job failed: ${job.id}: ${error.message}`);
  }

  private templateCache = new Map<string, string>();

  private readTemplate(filename: string): string {
    if (this.templateCache.has(filename)) {
      return this.templateCache.get(filename)!;
    }
    const filePath = path.join(__dirname, "templates", filename);
    const content = fs.readFileSync(filePath, "utf-8");
    this.templateCache.set(filename, content);
    return content;
  }

  private renderTemplate(
    template: EmailTemplate,
    variables?: Record<string, unknown>,
  ): { subject: string; html: string } {
    const config = TEMPLATE_CONFIG[template];
    const subject = config.subject;

    let baseHtml = this.readTemplate("base.html");
    let contentHtml = this.readTemplate(config.file);

    const allVariables = {
      ...variables,
      year: new Date().getFullYear().toString(),
    };

    for (const [key, value] of Object.entries(allVariables)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      contentHtml = contentHtml.replace(regex, escapeHtml(String(value)));
    }

    for (const [key, value] of Object.entries(allVariables)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      baseHtml = baseHtml.replace(regex, String(value));
    }

    baseHtml = baseHtml.replace("{{content}}", contentHtml);

    return { subject, html: baseHtml };
  }
}
