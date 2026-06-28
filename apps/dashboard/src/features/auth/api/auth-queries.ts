import { queryOptions } from "@tanstack/react-query";
import { authApi } from "./auth-api";

export const authQueryKeys = {
  all: () => ["auth"] as const,
  me: () => [...authQueryKeys.all(), "me"] as const,
};

export const authQueries = {
  me: () =>
    queryOptions({
      queryKey: authQueryKeys.me(),
      queryFn: authApi.me,
      staleTime: 5 * 60 * 1000,
      retry: false,
    }),
};
