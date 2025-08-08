import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

interface UseApiOptions<T> {
  onSuccess?: (data: T, message: string) => void;
  onError?: (error: string) => void;
  successMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  responseSchema?: z.ZodSchema<T>;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiResult<T> {
  success: boolean;
  data: T | null;
  message: string;
}

// Enhanced useApi hook with better type safety and service integration
export function useApi<T = unknown>(options: UseApiOptions<T> = {}) {
  const {
    onSuccess,
    onError,
    successMessage,
    showSuccessToast = false,
    showErrorToast = true,
    responseSchema,
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (
      apiServiceCall: () => Promise<{ data: T; message: string }>
    ): Promise<ApiResult<T>> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const { data, message } = await apiServiceCall();
        
        // Validate data if schema provided
        let validatedData: T = data;
        if (responseSchema) {
          validatedData = responseSchema.parse(data);
        }

        setState({
          data: validatedData,
          loading: false,
          error: null,
        });

        // Show success message
        const finalMessage = successMessage || message;
        if (showSuccessToast && finalMessage) {
          toast.success(finalMessage);
        }

        // Call success callback
        if (onSuccess) {
          onSuccess(validatedData, finalMessage);
        }

        return { success: true, data: validatedData, message: finalMessage };
      } catch (error) {
        const errorMessage = (error as Error).message;

        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });

        if (showErrorToast) {
          toast.error(errorMessage);
        }

        if (onError) {
          onError(errorMessage);
        }

        return { success: false, data: null, message: errorMessage };
      }
    },
    [onSuccess, onError, successMessage, showSuccessToast, showErrorToast, responseSchema]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Simplified hook for form submissions
export function useApiMutation<T = unknown>(
  options: Omit<UseApiOptions<T>, 'responseSchema'> & {
    onSuccess?: (data: T, message: string) => void;
  } = {}
) {
  const {
    onSuccess,
    onError,
    successMessage = 'Operation completed successfully',
    showSuccessToast = true,
    showErrorToast = true,
  } = options;

  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
  }>({
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (
      apiServiceCall: () => Promise<{ data: T; message: string }>
    ): Promise<ApiResult<T>> => {
      setState({ loading: true, error: null });

      try {
        const { data, message } = await apiServiceCall();

        setState({ loading: false, error: null });

        // Show success message
        const finalMessage = successMessage || message;
        if (showSuccessToast && finalMessage) {
          toast.success(finalMessage);
        }

        // Call success callback
        if (onSuccess) {
          onSuccess(data, finalMessage);
        }

        return { success: true, data, message: finalMessage };
      } catch (error) {
        const errorMessage = (error as Error).message;

        setState({ loading: false, error: errorMessage });

        if (showErrorToast) {
          toast.error(errorMessage);
        }

        if (onError) {
          onError(errorMessage);
        }

        return { success: false, data: null, message: errorMessage };
      }
    },
    [onSuccess, onError, successMessage, showSuccessToast, showErrorToast]
  );

  return {
    ...state,
    mutate,
  };
}
