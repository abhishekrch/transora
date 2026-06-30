import { apiClient, apiRoutes } from "@transora/shared";
import type {
  LoginInput,
  RegisterInput,
  AuthResponse,
  AuthTokens,
} from "@transora/shared";

export const authApi = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const { data: responseBody } = await apiClient.post(apiRoutes.auth.login(), data);
    return responseBody.data;
  },

  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const { data: responseBody } = await apiClient.post(apiRoutes.auth.register(), data);
    return responseBody.data;
  },

  refresh: async (): Promise<AuthTokens> => {
    const { data: responseBody } = await apiClient.post(apiRoutes.auth.refresh());
    return responseBody.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  me: async (): Promise<AuthResponse["user"]> => {
    const { data: responseBody } = await apiClient.get(apiRoutes.auth.me());
    return responseBody.data;
  },
};
