import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { WidgetService } from "@/modules/widget/widget.service";
import { ApiKeyGuard } from "@/common/guards/api-key.guard";
import type { AuthenticatedRequest } from "@/common/interfaces/website-context.interface";

@Controller("widget")
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  @Get()
  @UseGuards(ApiKeyGuard)
  getSettings(@Req() req: AuthenticatedRequest) {
    return this.widgetService.getSettings(req.website);
  }
}
