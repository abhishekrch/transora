import { Module } from "@nestjs/common";
import { WebsiteController } from "@/modules/website/website.controller";
import { WebsiteService } from "@/modules/website/website.service";

@Module({
  controllers: [WebsiteController],
  providers: [WebsiteService],
  exports: [WebsiteService],
})
export class WebsiteModule {}
