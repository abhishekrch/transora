import { Injectable } from "@nestjs/common";
import type { WidgetSettings } from "@transora/shared";
import type { WebsiteContext } from "@/common/interfaces/website-context.interface";

@Injectable()
export class WidgetService {
  getSettings(website: WebsiteContext): WidgetSettings {
    return {
      defaultLanguage: website.defaultLanguage,
      allowedLanguages: website.allowedLanguages,
      switcherPosition: website.switcherPosition,
      switcherStyle: website.switcherStyle,
      seoHreflang: website.seoHreflang,
      seoMetaTranslate: website.seoMetaTranslate,
    };
  }
}
