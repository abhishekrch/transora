import { configureApiClient } from "@transora/shared";
import { useAuthStore } from "@/features/auth/hooks/use-auth";
import { authApi } from "@/features/auth/api/auth-api";

export function bootstrap() {
  configureApiClient({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
    getAccessToken: () => useAuthStore.getState().accessToken,
    refreshAccessToken: async () => {
      try {
        const response = await authApi.refresh();
        const newToken = response.accessToken;
        useAuthStore.getState().setAccessToken(newToken);
        return newToken;
      } catch {
        useAuthStore.getState().clearAuth();
        return null;
      }
    },
  });

  const { isAuthenticated, accessToken } = useAuthStore.getState();
  if (isAuthenticated && !accessToken) {
    authApi
      .refresh()
      .then((data) => {
        useAuthStore.getState().setAccessToken(data.accessToken);
      })
      .catch(() => {
        useAuthStore.getState().clearAuth();
      });
  }
}
