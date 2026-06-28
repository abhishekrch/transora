export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface OverviewResult {
  totalTranslations: number;
  cacheHits: number;
  cacheMisses: number;
  cacheHitRate: number;
  azureCalls: number;
  charsTranslated: number;
  uniqueLanguages: string[];
  period: string;
  startDate: string;
  endDate: string;
}

export interface DailyStatsEntry {
  date: string;
  totalTranslations: number;
  cacheHits: number;
  cacheMisses: number;
  azureCalls: number;
  charsTranslated: number;
}

export interface LanguageStatsEntry {
  language: string;
  translationCount: number;
  percentage: number;
}

export interface WebsiteStatsSummary {
  websiteId: string;
  domain: string;
  totalTranslations: number;
  cacheHitRate: number;
  charsTranslated: number;
  activeDays: number;
}
