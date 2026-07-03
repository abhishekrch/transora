import axios from "axios";
import type { ApiError } from "@/schemas/auth";

export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as (Omit<ApiError, "message"> & { message?: string | string[] }) | undefined;

    if (apiError?.details && apiError.details.length > 0) {
      return apiError.details[0]!.message;
    }

    if (Array.isArray(apiError?.message)) {
      return apiError.message[0]!;
    }

    if (typeof apiError?.message === "string") {
      return apiError.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
