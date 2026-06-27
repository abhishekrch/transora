import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvConfig } from "./env.validation";

@Injectable()
export class AppConfig {
  constructor(private configService: ConfigService<EnvConfig, true>) {}

  // App
  get nodeEnv(): string {
    return this.configService.get("NODE_ENV", { infer: true });
  }

  get isProduction(): boolean {
    return this.nodeEnv === "production";
  }

  get port(): number {
    return this.configService.get("PORT", { infer: true });
  }

  // Database
  get databaseUrl(): string {
    return this.configService.get("DATABASE_URL", { infer: true });
  }

  // Redis
  get redisUrl(): string {
    return this.configService.get("REDIS_URL", { infer: true });
  }

  // Azure
  get azureTranslatorKey(): string {
    return this.configService.get("AZURE_TRANSLATOR_KEY", { infer: true });
  }

  get azureRegion(): string {
    return this.configService.get("AZURE_REGION", { infer: true });
  }

  // Auth
  get jwtSecret(): string {
    return this.configService.get("JWT_SECRET", { infer: true });
  }

  get jwtRefreshSecret(): string {
    return this.configService.get("JWT_REFRESH_SECRET", { infer: true });
  }

  // Email
  get resendApiKey(): string {
    return this.configService.get("RESEND_API_KEY", { infer: true });
  }

  // Dashboard
  get dashboardUrl(): string {
    return this.configService.get("DASHBOARD_URL", { infer: true });
  }
}
