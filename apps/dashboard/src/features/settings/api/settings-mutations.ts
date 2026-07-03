import { useMutation } from "@tanstack/react-query";
import { settingsApi } from "./settings-api";
import { useAuthStore } from "@/features/auth/hooks/use-auth";
import { toast } from "sonner";
import { getErrorMessage } from "@transora/shared";
import type { UpdateUserInput, ChangePasswordInput } from "@transora/shared";

export function useUpdateProfile() {
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: (input: UpdateUserInput) => settingsApi.updateProfile(input),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update profile"));
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => settingsApi.changePassword(input),
    onSuccess: () => {
      toast.success("Password updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update password"));
    },
  });
}
