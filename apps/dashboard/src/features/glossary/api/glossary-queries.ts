import { queryOptions } from "@tanstack/react-query";
import { glossaryApi } from "./glossary-api";

export const glossaryKeys = {
  all: (websiteId: string) => ["glossary", websiteId] as const,
};

export const glossaryQueries = {
  list: (websiteId: string) =>
    queryOptions({
      queryKey: glossaryKeys.all(websiteId),
      queryFn: () => glossaryApi.list(websiteId),
      staleTime: 5 * 60 * 1000,
    }),
};
