import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { AppConfig } from "../config/app.config";

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [AppConfig],
      useFactory: (config: AppConfig) => ({
        pinoHttp: {
          level: config.isProduction ? "info" : "debug",

          transport: config.isProduction
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
      }),
    }),
  ],
})
export class AppLoggerModule {}
