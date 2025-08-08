import type { AxiosResponse } from 'axios';

interface StandardResponse<T = unknown> {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: T;
}

export function getData<T = unknown>(response: AxiosResponse): T {
  const body = response?.data as StandardResponse<T> | T;
  if (body && typeof body === 'object' && 'success' in (body as Record<string, unknown>)) {
    const std = body as StandardResponse<T>;
    return (std.data as T) as T;
  }
  return body as T;
}

export function getMessage(response: AxiosResponse): string | undefined {
  const body = response?.data as StandardResponse<unknown> | unknown;
  if (body && typeof body === 'object' && 'message' in (body as Record<string, unknown>)) {
    return (body as StandardResponse).message;
  }
  return undefined;
}

export function isSuccess(response: AxiosResponse): boolean | undefined {
  const body = response?.data as StandardResponse<unknown> | unknown;
  if (body && typeof body === 'object' && 'success' in (body as Record<string, unknown>)) {
    return (body as StandardResponse).success;
  }
  return undefined;
}
