import { Controller, Post, Get, UseGuards, HttpCode, HttpStatus, Req, Res } from "@nestjs/common";
import { RegisterSchema, LoginSchema, type RegisterInput, type LoginInput } from "@transora/shared";
import { AuthService } from "./auth.service";
import { ZodBody } from "@/common/decorators/zod-body.decorator";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import type { Request, Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(
    @ZodBody(RegisterSchema) body: RegisterInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(body);
    this.authService.setRefreshTokenCookie(res, result.refreshToken);
    return { user: result.user, accessToken: result.accessToken };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @ZodBody(LoginSchema) body: LoginInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body);
    this.authService.setRefreshTokenCookie(res, result.refreshToken);
    return { user: result.user, accessToken: result.accessToken };
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.["refreshToken"];
    if (!refreshToken) {
      return this.authService.refresh("");
    }
    const tokens = await this.authService.refresh(refreshToken);
    this.authService.setRefreshTokenCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.clearRefreshTokenCookie(res);
    return { success: true };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser("id") userId: string) {
    return this.authService.getProfile(userId);
  }
}
