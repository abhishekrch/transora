import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { statsQueries } from "@/features/dashboard/api/stats-queries";
import { websiteQueries } from "@/features/websites/api/website-queries";

export interface GlobalStats {
  totalTranslations: number;
  charsTranslated: number;
  cacheHitRate: number;
  activeWebsitesCount: number;
  uniqueLanguagesCount: number;
  azureCalls: number;
}

export function aggregateGlobalStats(
  websiteStats: { totalTranslations: number; cacheHitRate: number; charsTranslated: number }[] | undefined,
  websites: { isActive: boolean; allowedLanguages: string[] }[] | undefined
): GlobalStats {
  if (!websiteStats || !websites) {
    return {
      totalTranslations: 0,
      charsTranslated: 0,
      cacheHitRate: 0,
      activeWebsitesCount: 0,
      uniqueLanguagesCount: 0,
      azureCalls: 0,
    };
  }

  const totalTranslations = websiteStats.reduce((sum, s) => sum + s.totalTranslations, 0);
  const charsTranslated = websiteStats.reduce((sum, s) => sum + s.charsTranslated, 0);

  const totalWithTranslations = websiteStats.filter((s) => s.totalTranslations > 0);
  const cacheHitRate = totalTranslations > 0
    ? Math.round(
        totalWithTranslations.reduce((sum, s) => sum + s.cacheHitRate * s.totalTranslations, 0) / totalTranslations
      )
    : 0;

  const activeWebsitesCount = websites.filter((w) => w.isActive).length;
  const uniqueLanguagesCount = new Set(websites.flatMap((w) => w.allowedLanguages)).size;

  const azureCalls = websiteStats.reduce((sum, s) => {
    const misses = Math.round(s.totalTranslations * (1 - s.cacheHitRate / 100));
    return sum + misses;
  }, 0);

  return {
    totalTranslations,
    charsTranslated,
    cacheHitRate,
    activeWebsitesCount,
    uniqueLanguagesCount,
    azureCalls,
  };
}

export function useGlobalStats() {
  const { data: websiteStats, isLoading: statsLoading } = useQuery(statsQueries.byWebsite());
  const { data: websites, isLoading: websitesLoading } = useQuery(websiteQueries.list());

  const isLoading = statsLoading || websitesLoading;
  const stats = aggregateGlobalStats(websiteStats, websites);

  return {
    ...stats,
    isLoading,
  };
}

export function useSuspenseGlobalStats() {
  const { data: websiteStats } = useSuspenseQuery(statsQueries.byWebsite());
  const { data: websites } = useSuspenseQuery(websiteQueries.list());

  return aggregateGlobalStats(websiteStats, websites);
}
