import { apiClient, apiRoutes } from "@transora/shared";
import type { StatsOverview, DailyStatsEntry, LanguageStatsEntry, WebsiteStatsSummary } from "@transora/shared";

export const statsApi = {
  overview: async (period: string = "30d"): Promise<StatsOverview> => {
    const { data: responseBody } = await apiClient.get(apiRoutes.stats.overview(), {
      params: { period },
    });
    return responseBody.data;
  },

  daily: async (websiteId: string, startDate: string, endDate: string): Promise<DailyStatsEntry[]> => {
    const { data: responseBody } = await apiClient.get(apiRoutes.stats.daily(), {
      params: { websiteId, startDate, endDate },
    });
    return responseBody.data;
  },

  languages: async (websiteId: string): Promise<LanguageStatsEntry[]> => {
    const { data: responseBody } = await apiClient.get(apiRoutes.stats.languages(), {
      params: { websiteId },
    });
    return responseBody.data;
  },

  byWebsite: async (): Promise<WebsiteStatsSummary[]> => {
    const { data: responseBody } = await apiClient.get(apiRoutes.stats.websites());
    return responseBody.data;
  },
};
