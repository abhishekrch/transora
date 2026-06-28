import type { AxiosError } from "axios";
import type { ApiError } from "@transora/shared";

export function getAuthErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiError>;

  if (!axiosError.response) {
    return "Network error. Please check your connection.";
  }

  const { status, data } = axiosError.response;

  switch (status) {
    case 401:
      return "Invalid email or password.";
    case 409:
      return "An account with this email may already exist. Try signing in.";
    case 429:
      return "Too many attempts. Please try again later.";
    case 400:
      if (data?.details && data.details.length > 0) {
        return data.details.map((d) => d.message).join(", ");
      }
      return data?.message ?? "Invalid input. Please check your details.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function getFieldErrors(
  error: unknown,
): Record<string, string> | null {
  const axiosError = error as AxiosError<ApiError>;

  if (!axiosError.response?.data?.details) {
    return null;
  }

  const fieldErrors: Record<string, string> = {};
  for (const detail of axiosError.response.data.details) {
    fieldErrors[detail.field] = detail.message;
  }
  return fieldErrors;
}
