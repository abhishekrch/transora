import { z } from "zod";

export const StatsQuerySchema = z
  .object({
    websiteId: z.uuid(),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const diffMs = end.getTime() - start.getTime();
      const maxDays = 365;
      return diffMs <= maxDays * 24 * 60 * 60 * 1000 && diffMs >= 0;
    },
    { message: "Date range must be between 0 and 365 days" },
  );

export type StatsQueryInput = z.infer<typeof StatsQuerySchema>;

export const StatsOverviewSchema = z.object({
  websiteId: z.uuid(),
  period: z.enum(["7d", "30d", "90d", "all"]).default("30d"),
});

export type StatsOverviewInput = z.infer<typeof StatsOverviewSchema>;

export interface StatsOverview {
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
