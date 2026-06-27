import { Injectable, ConflictException, UnauthorizedException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "@/prisma/prisma.service";
import { AppConfig } from "@/config/app.config";
import { PasswordService } from "@/common/services/password.service";
import { ApiResponse, JWT_ACCESS_TTL, JWT_REFRESH_TTL } from "@transora/shared";
import type { RegisterInput, LoginInput } from "@transora/shared";
import { Prisma } from "@prisma/client";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: AppConfig,
    private readonly passwordService: PasswordService
  ) {}

  async register(input: RegisterInput) {
    const passwordHash = await this.passwordService.hash(input.password);

    try {
      const user = await this.prisma.user.create({
        data: { email: input.email, passwordHash, companyName: input.companyName },
        select: { id: true, email: true, companyName: true, emailVerified: true, createdAt: true },
      });

      this.logger.log(`User registered: ${input.email}`);

      const tokens = this.generateTokens(user.id, user.email);
      const data = { user, ...tokens };

      return new ApiResponse(data, "Registration successful");
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
    const data = { user: userWithoutPassword, ...tokens };

    return new ApiResponse(data, "Login successful");
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.jwtRefreshSecret,
      });

      this.logger.log(`Tokens refreshed for user: ${payload.email}`);

      const tokens = this.generateTokens(payload.sub, payload.email);

      return new ApiResponse(tokens, "Tokens refreshed");
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, companyName: true, emailVerified: true, createdAt: true },
    });

    return new ApiResponse(user);
  }

  private generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    return {
      accessToken: this.jwtService.sign(payload, { secret: this.config.jwtSecret, expiresIn: JWT_ACCESS_TTL }),
      refreshToken: this.jwtService.sign(payload, { secret: this.config.jwtRefreshSecret, expiresIn: JWT_REFRESH_TTL }),
    };
  }
}
