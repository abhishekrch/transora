import { Request } from "express";

export interface WebsiteContext {
  id: string;
  userId: string;
  domain: string;
  apiKey: string;
  defaultLanguage: string;
  allowedLanguages: string[];
  rateLimitPerMin: number;
  dailyCharLimit: number;
  switcherPosition: string;
  switcherStyle: string;
  seoHreflang: boolean;
  seoMetaTranslate: boolean;
  isActive: boolean;
}

export interface AuthenticatedRequest extends Request {
  website: WebsiteContext;
}
