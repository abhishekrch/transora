import { Controller, Get, Post, Patch, Delete, Param, UseGuards, ParseUUIDPipe } from "@nestjs/common";
import { CreateWebsiteSchema, UpdateWebsiteSchema, type CreateWebsiteInput, type UpdateWebsiteInput } from "@transora/shared";
import { WebsiteService } from "./website.service";
import { ZodBody } from "@/common/decorators/zod-body.decorator";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { CurrentUser } from "@/modules/auth/decorators/current-user.decorator";

@UseGuards(JwtAuthGuard)
@Controller("websites")
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Get()
  findAll(@CurrentUser("id") userId: string) {
    return this.websiteService.findAll(userId);
  }

  @Post()
  create(@CurrentUser("id") userId: string, @ZodBody(CreateWebsiteSchema) body: CreateWebsiteInput) {
    return this.websiteService.create(userId, body);
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string, @CurrentUser("id") userId: string) {
    return this.websiteService.findOne(id, userId);
  }

  @Patch(":id")
  update(@Param("id", ParseUUIDPipe) id: string, @CurrentUser("id") userId: string, @ZodBody(UpdateWebsiteSchema) body: UpdateWebsiteInput) {
    return this.websiteService.update(id, userId, body);
  }

  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string, @CurrentUser("id") userId: string) {
    return this.websiteService.remove(id, userId);
  }

  @Post(":id/regenerate-key")
  regenerateApiKey(@Param("id", ParseUUIDPipe) id: string, @CurrentUser("id") userId: string) {
    return this.websiteService.regenerateApiKey(id, userId);
  }
}
