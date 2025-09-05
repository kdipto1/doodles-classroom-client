import { AxiosError } from "axios";
import { useCallback } from "react";

interface ApiError {
  message: string;
  errorMessages?: { path: string; message: string }[];
}

export const useApiError = () => {
  const getErrorMessage = useCallback((error: unknown) => {
    if (error instanceof AxiosError) {
      const apiError = error.response?.data as ApiError;
      if (apiError?.message) {
        return apiError.message;
      }
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "An unexpected error occurred";
  }, []);

  return { getErrorMessage };
};