export const apiRoutes = {
  auth: {
    login: () => "/auth/login" as const,
    register: () => "/auth/register" as const,
    refresh: () => "/auth/refresh" as const,
    me: () => "/auth/me" as const,
  },
  websites: {
    root: () => "/websites" as const,
    byId: (id: string) => `/websites/${id}` as const,
    regenerateKey: (id: string) => `/websites/${id}/regenerate-key` as const,
  },
  glossary: {
    root: (websiteId: string) =>
      `/websites/${websiteId}/glossary` as const,
    byId: (websiteId: string, id: string) =>
      `/websites/${websiteId}/glossary/${id}` as const,
  },
  stats: {
    overview: () => "/stats/overview" as const,
    daily: () => "/stats/daily" as const,
    languages: () => "/stats/languages" as const,
    websites: () => "/stats/websites" as const,
  },
  translate: {
    batch: () => "/translate/batch" as const,
  },
  config: {
    root: () => "/config" as const,
  },
} as const;
