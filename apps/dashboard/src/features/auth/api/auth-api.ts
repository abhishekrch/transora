import { apiClient, apiRoutes } from "@transora/shared";
import type {
  LoginInput,
  RegisterInput,
  AuthResponse,
  AuthTokens,
} from "@transora/shared";

export const authApi = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await apiClient.post(apiRoutes.auth.login(), data);
    return response.data.data;
  },

  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const response = await apiClient.post(apiRoutes.auth.register(), data);
    return response.data.data;
  },

  refresh: async (): Promise<AuthTokens> => {
    const response = await apiClient.post(apiRoutes.auth.refresh());
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  me: async (): Promise<AuthResponse["user"]> => {
    const response = await apiClient.get(apiRoutes.auth.me());
    return response.data.data;
  },
};
