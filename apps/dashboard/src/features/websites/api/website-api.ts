import { apiClient, apiRoutes } from "@transora/shared";
import type { Website, CreateWebsiteInput, UpdateWebsiteInput } from "@transora/shared";

export const websiteApi = {
  list: async (): Promise<Website[]> => {
    const { data: responseBody } = await apiClient.get(apiRoutes.websites.root());
    return responseBody.data;
  },

  get: async (id: string): Promise<Website> => {
    const { data: responseBody } = await apiClient.get(apiRoutes.websites.byId(id));
    return responseBody.data;
  },

  create: async (input: CreateWebsiteInput): Promise<Website> => {
    const { data: responseBody } = await apiClient.post(apiRoutes.websites.root(), input);
    return responseBody.data;
  },

  update: async (id: string, input: UpdateWebsiteInput): Promise<Website> => {
    const { data: responseBody } = await apiClient.put(apiRoutes.websites.byId(id), input);
    return responseBody.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(apiRoutes.websites.byId(id));
  },

  regenerateKey: async (id: string): Promise<{ apiKey: string }> => {
    const { data: responseBody } = await apiClient.post(apiRoutes.websites.regenerateKey(id));
    return responseBody.data;
  },
};
