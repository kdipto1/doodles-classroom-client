import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for sending cookies (refresh token)
});

// Request interceptor to add access token
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // The response is handled by the calling function
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not a refresh token request, try to refresh
    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest.url !== "/auth/login" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Mark request as retried

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        // Handle the standard response format
        const accessToken = refreshResponse.data.success
          ? refreshResponse.data.data.accessToken
          : null;

        if (!accessToken) {
          throw new Error("Failed to refresh token");
        }

        // Update tokens in localStorage
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        user.accessToken = accessToken;
        localStorage.setItem("user", JSON.stringify(user));

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
