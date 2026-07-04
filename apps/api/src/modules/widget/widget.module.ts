import { Module } from "@nestjs/common";
import { WidgetController } from "@/modules/widget/widget.controller";
import { WidgetService } from "@/modules/widget/widget.service";

@Module({
  controllers: [WidgetController],
  providers: [WidgetService],
})
export class WidgetModule {}
