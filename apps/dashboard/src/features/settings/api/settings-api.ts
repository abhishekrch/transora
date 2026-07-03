import { apiClient } from "@transora/shared";
import type { User, UpdateUserInput, ChangePasswordInput } from "@transora/shared";

export const settingsApi = {
  updateProfile: async (input: UpdateUserInput): Promise<User> => {
    const { data: responseBody } = await apiClient.put("/auth/profile", input);
    return responseBody.data;
  },

  changePassword: async (input: ChangePasswordInput): Promise<void> => {
    await apiClient.post("/auth/change-password", input);
  },
};
