import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authApi } from "./auth-api";
import { useAuthStore } from "../hooks/use-auth";
import { authQueryKeys } from "./auth-queries";

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      useAuthStore
        .getState()
        .setAuth(data.user, data.accessToken, data.refreshToken);
      queryClient.invalidateQueries({ queryKey: authQueryKeys.all() });
      navigate({ to: "/" });
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      useAuthStore
        .getState()
        .setAuth(data.user, data.accessToken, data.refreshToken);
      queryClient.invalidateQueries({ queryKey: authQueryKeys.all() });
      navigate({ to: "/" });
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return () => {
    useAuthStore.getState().clearAuth();
    queryClient.clear();
    navigate({ to: "/login" });
  };
}
