import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from "@nestjs/common";
import { Response } from "express";

@Injectable()
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let error = "INTERNAL_SERVER_ERROR";
    let details: { field: string; message: string }[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === "object") {
        const resp = exceptionResponse as any;
        message = resp.message || message;
        error = resp.error || error;
        if (Array.isArray(resp.message)) {
          details = resp.message.map((msg: string) => ({
            field: "unknown",
            message: msg,
          }));
        }
      }
    }

    if (exception instanceof Error && !(exception instanceof HttpException)) {
      this.logger.error("Unhandled exception", exception.stack);
      message = process.env.NODE_ENV === "production"
        ? "Internal server error"
        : exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      details,
    });
  }
}
