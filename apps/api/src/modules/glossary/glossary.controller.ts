import { Controller, Get, Post, Patch, Delete, Param, Query, UseGuards, HttpCode, HttpStatus } from "@nestjs/common";
import { CreateGlossarySchema, UpdateGlossarySchema, PaginationSchema, type CreateGlossaryInput, type UpdateGlossaryInput, type PaginationInput } from "@transora/shared";
import { GlossaryService } from "@/modules/glossary/glossary.service";
import { ZodBody } from "@/common/decorators/zod-body.decorator";
import { ZodQueryPipe } from "@/common/pipes/zod-query.pipe";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { CurrentUser } from "@/modules/auth/decorators/current-user.decorator";

@UseGuards(JwtAuthGuard)
@Controller("websites/:websiteId/glossary")
export class GlossaryController {
  constructor(private readonly glossaryService: GlossaryService) {}

  @Get()
  findAll(
    @Param("websiteId") websiteId: string,
    @CurrentUser("id") userId: string,
    @Query(new ZodQueryPipe(PaginationSchema)) pagination: PaginationInput,
  ) {
    return this.glossaryService.findAll(websiteId, userId, pagination);
  }

  @Post()
  create(
    @Param("websiteId") websiteId: string,
    @CurrentUser("id") userId: string,
    @ZodBody(CreateGlossarySchema) body: CreateGlossaryInput,
  ) {
    return this.glossaryService.create(websiteId, userId, body);
  }

  @Patch(":id")
  update(
    @Param("websiteId") websiteId: string,
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @ZodBody(UpdateGlossarySchema) body: UpdateGlossaryInput,
  ) {
    return this.glossaryService.update(id, websiteId, userId, body);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param("websiteId") websiteId: string,
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.glossaryService.remove(id, websiteId, userId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAll(
    @Param("websiteId") websiteId: string,
    @CurrentUser("id") userId: string,
    @Query("confirm") confirm?: string,
  ) {
    return this.glossaryService.removeAll(websiteId, userId, confirm === "true");
  }
}
