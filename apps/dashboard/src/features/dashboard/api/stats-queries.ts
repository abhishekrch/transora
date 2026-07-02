import { queryOptions } from "@tanstack/react-query";
import { statsApi } from "./stats-api";

export const statsKeys = {
  all: () => ["stats"] as const,
  overview: (period: string) => ["stats", "overview", period] as const,
  daily: (websiteId: string, start: string, end: string) =>
    ["stats", "daily", websiteId, start, end] as const,
  languages: (websiteId: string) => ["stats", "languages", websiteId] as const,
  byWebsite: () => ["stats", "websites"] as const,
};

export const statsQueries = {
  overview: (period: string = "30d") =>
    queryOptions({
      queryKey: statsKeys.overview(period),
      queryFn: () => statsApi.overview(period),
      staleTime: 5 * 60 * 1000,
    }),

  byWebsite: () =>
    queryOptions({
      queryKey: statsKeys.byWebsite(),
      queryFn: statsApi.byWebsite,
      staleTime: 5 * 60 * 1000,
    }),
};
