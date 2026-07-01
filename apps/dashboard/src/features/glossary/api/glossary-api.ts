import { apiClient, apiRoutes } from "@transora/shared";
import type { Glossary, CreateGlossaryInput, UpdateGlossaryInput } from "@transora/shared";

export const glossaryApi = {
  list: async (websiteId: string): Promise<Glossary[]> => {
    const { data: responseBody } = await apiClient.get(apiRoutes.glossary.root(websiteId));
    return responseBody.data.data;
  },

  create: async (websiteId: string, input: CreateGlossaryInput): Promise<Glossary> => {
    const { data: responseBody } = await apiClient.post(apiRoutes.glossary.root(websiteId), input);
    return responseBody.data;
  },

  update: async (websiteId: string, id: string, input: UpdateGlossaryInput): Promise<Glossary> => {
    const { data: responseBody } = await apiClient.put(apiRoutes.glossary.byId(websiteId, id), input);
    return responseBody.data;
  },

  delete: async (websiteId: string, id: string): Promise<void> => {
    await apiClient.delete(apiRoutes.glossary.byId(websiteId, id));
  },
};
