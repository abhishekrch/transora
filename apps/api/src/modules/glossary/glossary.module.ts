import { Module } from "@nestjs/common";
import { PrismaModule } from "@/prisma/prisma.module";
import { WebsiteModule } from "@/modules/website/website.module";
import { GlossaryController } from "@/modules/glossary/glossary.controller";
import { GlossaryService } from "@/modules/glossary/glossary.service";

@Module({
  imports: [PrismaModule, WebsiteModule],
  controllers: [GlossaryController],
  providers: [GlossaryService],
  exports: [GlossaryService],
})
export class GlossaryModule {}
