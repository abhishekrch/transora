import { Controller, Post, Get, UseGuards, HttpCode, HttpStatus } from "@nestjs/common";
import { RegisterSchema, LoginSchema, RefreshTokenSchema, type RegisterInput, type LoginInput, type RefreshTokenInput } from "@transora/shared";
import { AuthService } from "./auth.service";
import { ZodBody } from "@/common/decorators/zod-body.decorator";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@ZodBody(RegisterSchema) body: RegisterInput) {
    return this.authService.register(body);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@ZodBody(LoginSchema) body: LoginInput) {
    return this.authService.login(body);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  refresh(@ZodBody(RefreshTokenSchema) body: RefreshTokenInput) {
    return this.authService.refresh(body.refreshToken);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser("id") userId: string) {
    return this.authService.getProfile(userId);
  }
}
