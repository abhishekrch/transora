import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DomainWhitelistGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const website = request.website;

    if (!website) {
      throw new ForbiddenException("Website not found in request");
    }

    const origin = request.headers.origin || request.headers.referer;

    if (!origin) {
      return true;
    }

    try {
      const originDomain = new URL(origin).hostname;
      const registeredDomain = website.domain;

      const isDev = this.configService.get<string>("NODE_ENV") !== "production";

      const isAllowed =
        originDomain === registeredDomain ||
        originDomain === `www.${registeredDomain}` ||
        `www.${originDomain}` === registeredDomain ||
        (isDev && (originDomain === "localhost" || originDomain === "127.0.0.1"));

      if (!isAllowed) {
        throw new ForbiddenException(
          `Domain '${originDomain}' is not authorized for this API key`,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      return true;
    }
  }
}
