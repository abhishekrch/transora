import { apiClient, apiRoutes } from "@transora/shared";
import type {
  LoginInput,
  RegisterInput,
  AuthResponse,
  AuthTokens,
} from "@transora/shared";

export const authApi = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      apiRoutes.auth.login(),
      data,
    );
    return response.data;
  },

  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      apiRoutes.auth.register(),
      data,
    );
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await apiClient.post<AuthTokens>(
      apiRoutes.auth.refresh(),
      { refreshToken },
    );
    return response.data;
  },

  me: async (): Promise<AuthResponse["user"]> => {
    const response = await apiClient.get<AuthResponse["user"]>(
      apiRoutes.auth.me(),
    );
    return response.data;
  },
};
