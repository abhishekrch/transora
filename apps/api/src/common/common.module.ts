import { Global, Module } from "@nestjs/common";
import { PasswordService } from "@/common/services/password.service";
import { ApiKeyGuard } from "@/common/guards/api-key.guard";

@Global()
@Module({
  providers: [PasswordService, ApiKeyGuard],
  exports: [PasswordService, ApiKeyGuard],
})
export class CommonModule {}
