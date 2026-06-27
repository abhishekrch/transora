import { Request } from "express";

export interface WebsiteContext {
  id: string;
  domain: string;
  apiKey: string;
  allowedLanguages: string[];
  rateLimitPerMin: number;
  dailyCharLimit: number;
  isActive: boolean;
}

export interface TranslateRequest extends Request {
  website: WebsiteContext;
}
