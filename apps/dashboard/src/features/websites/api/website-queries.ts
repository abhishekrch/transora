import { queryOptions } from "@tanstack/react-query";
import { websiteApi } from "./website-api";

export const websiteKeys = {
  all: () => ["websites"] as const,
  detail: (id: string) => ["websites", id] as const,
};

export const websiteQueries = {
  list: () =>
    queryOptions({
      queryKey: websiteKeys.all(),
      queryFn: websiteApi.list,
      staleTime: 5 * 60 * 1000,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: websiteKeys.detail(id),
      queryFn: () => websiteApi.get(id),
      staleTime: 5 * 60 * 1000,
    }),
};
