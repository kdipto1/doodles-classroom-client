import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosError } from "axios";

// Create a client with optimized default settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that unused/inactive cache data remains in memory
      gcTime: 1000 * 60 * 5, // 5 minutes
      // Time in milliseconds after data is considered stale
      staleTime: 1000 * 30, // 30 seconds
      // Retry failed requests
      retry: (failureCount, error) => {
        if (error instanceof AxiosError && error.response) {
          // Don't retry on 4xx errors except 408, 429
          if (error.response.status >= 400 && error.response.status < 500) {
            if (error.response.status === 408 || error.response.status === 429) {
              return failureCount < 2;
            }
            return false;
          }
        }
        // Retry other errors up to 3 times
        return failureCount < 3;
      },
      // Refetch on window focus for important data
      refetchOnWindowFocus: true,
      // Don't refetch on reconnect by default (can be enabled per query)
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry mutations on network errors
      retry: (failureCount, error) => {
        if (error instanceof AxiosError && error.response) {
          // Don't retry on 4xx errors
          if (error.response.status >= 400 && error.response.status < 500) {
            return false;
          }
        }
        return failureCount < 2;
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
      {/* Only show DevTools in development */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  </StrictMode>,
);
