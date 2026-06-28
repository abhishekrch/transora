import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { WorkerModule } from "./worker.module";

async function bootstrap() {
  const logger = new Logger("Worker");

  const app = await NestFactory.createApplicationContext(WorkerModule, {
    logger: ["error", "warn", "log"],
  });

  logger.log("Worker started and listening for jobs...");

  process.on("SIGTERM", async () => {
    logger.log("SIGTERM received, shutting down worker...");
    await app.close();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    logger.log("SIGINT received, shutting down worker...");
    await app.close();
    process.exit(0);
  });
}

bootstrap();
