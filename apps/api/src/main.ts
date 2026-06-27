import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { Logger } from "nestjs-pino";
import helmet from "helmet";
import { AppModule } from "@/app.module";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { ResponseInterceptor } from "@/common/interceptors/response.interceptor";
import type { EnvConfig } from "@/config/env.validation";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  const config = app.get(ConfigService<EnvConfig, true>);

  app.use(helmet());

  app.enableCors({
    origin: [config.get("DASHBOARD_URL", { infer: true })],
    credentials: true,
  });

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalFilters(app.get(HttpExceptionFilter));

  app.enableShutdownHooks();

  app.getHttpAdapter().get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  await app.listen(config.get("PORT", { infer: true }));
}

bootstrap();
