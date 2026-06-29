import { Injectable, ConflictException, UnauthorizedException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "@/prisma/prisma.service";
import { PasswordService } from "@/common/services/password.service";
import { EmailService } from "@/modules/email/email.service";
import { JWT_ACCESS_TTL, JWT_REFRESH_TTL } from "@transora/shared";
import type { RegisterInput, LoginInput } from "@transora/shared";
import type { EnvConfig } from "@/config/env.validation";
import type { Response } from "express";
import { Prisma } from "@prisma/client";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<EnvConfig, true>,
    private readonly passwordService: PasswordService,
    private readonly emailService: EmailService
  ) {}

  async register(input: RegisterInput) {
    const passwordHash = await this.passwordService.hash(input.password);

    try {
      const user = await this.prisma.user.create({
        data: { email: input.email, passwordHash, companyName: input.companyName },
        select: { id: true, email: true, companyName: true, emailVerified: true, createdAt: true },
      });

      this.logger.log(`User registered: ${input.email}`);

      this.emailService.send({
        to: user.email,
        template: "welcome",
        variables: { name: user.companyName || "there" },
        userId: user.id,
      }).catch((err) => this.logger.warn(`Failed to queue welcome email: ${err}`));

      const tokens = this.generateTokens(user.id, user.email);

      return { user, ...tokens };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictException("Email already registered");
      }
      throw error;
    }
  }

  async login(input: LoginInput) {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const valid = await this.passwordService.verify(user.passwordHash, input.password);

    if (!valid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    this.logger.log(`User logged in: ${input.email}`);

    const { passwordHash, ...userWithoutPassword } = user;
    const tokens = this.generateTokens(user.id, user.email);

    return { user: userWithoutPassword, ...tokens };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get("JWT_REFRESH_SECRET", { infer: true }),
      });

      this.logger.log(`Tokens refreshed for user: ${payload.email}`);

      return this.generateTokens(payload.sub, payload.email);
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, companyName: true, emailVerified: true, createdAt: true },
    });
  }

  private generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.config.get("JWT_SECRET", { infer: true }),
        expiresIn: JWT_ACCESS_TTL,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.config.get("JWT_REFRESH_SECRET", { infer: true }),
        expiresIn: JWT_REFRESH_TTL,
      }),
    };
  }

  setRefreshTokenCookie(res: Response, refreshToken: string) {
    const isProduction = this.config.get("NODE_ENV", { infer: true }) === "production";
    const cookieDomain = this.config.get("COOKIE_DOMAIN", { infer: true });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });
  }

  clearRefreshTokenCookie(res: Response) {
    const isProduction = this.config.get("NODE_ENV", { infer: true }) === "production";
    const cookieDomain = this.config.get("COOKIE_DOMAIN", { infer: true });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });
  }
}
