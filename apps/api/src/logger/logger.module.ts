import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import type { EnvConfig } from "@/config/env.validation";

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvConfig, true>) => {
        const isProduction = config.get("NODE_ENV", { infer: true }) === "production";

        return {
          pinoHttp: {
            level: isProduction ? "info" : "debug",

            transport: isProduction
              ? undefined
              : {
                  target: "pino-pretty",
                  options: {
                    colorize: true,
                    singleLine: true,
                    translateTime: "SYS:HH:MM:ss",
                    ignore: "pid,hostname",
                  },
                },

            autoLogging: true,

            serializers: {
              req: (req) => ({
                method: req.method,
                url: req.url,
                remoteAddress: req.remoteAddress,
              }),
              res: (res) => ({
                statusCode: res.statusCode,
              }),
            },

            customLogLevel: (req, res, err) => {
              if (res.statusCode >= 500 || err) return "error";
              if (res.statusCode >= 400) return "warn";
              return "info";
            },

            customSuccessMessage: (req, res) => {
              return `${req.method} ${req.url} ${res.statusCode}`;
            },

            customErrorMessage: (req, res, err) => {
              return `${req.method} ${req.url} ${res.statusCode} - ${err.message}`;
            },
          },
        };
      },
    }),
  ],
})
export class AppLoggerModule {}
