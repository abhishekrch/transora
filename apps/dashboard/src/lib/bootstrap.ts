import { configureApiClient } from "@transora/shared";
import { useAuthStore } from "@/features/auth/hooks/use-auth";
import { authApi } from "@/features/auth/api/auth-api";

export function bootstrap() {
  configureApiClient({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
    getAccessToken: () => useAuthStore.getState().accessToken,
    refreshAccessToken: async () => {
      const refreshToken = useAuthStore.getState().refreshToken;
      if (!refreshToken) {
        useAuthStore.getState().clearAuth();
        return null;
      }
      try {
        const response = await authApi.refresh(refreshToken);
        const { accessToken, refreshToken: newRefreshToken } = response;
        const user = useAuthStore.getState().user;
        if (user) {
          useAuthStore.getState().setAuth(user, accessToken, newRefreshToken);
        }
        return accessToken;
      } catch {
        useAuthStore.getState().clearAuth();
        return null;
      }
    },
  });
}
