import { Module } from "@nestjs/common";
import { AuthModule } from "@/modules/auth/auth.module";
import { WebsiteController } from "@/modules/website/website.controller";
import { WebsiteService } from "@/modules/website/website.service";

@Module({
  imports: [AuthModule],
  controllers: [WebsiteController],
  providers: [WebsiteService],
  exports: [WebsiteService],
})
export class WebsiteModule {}
