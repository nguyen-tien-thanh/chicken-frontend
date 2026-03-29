import { TOKEN_KEY } from "@/providers/constants";
import type { HttpError } from "@refinedev/core";
import axios from "axios";

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const url = typeof config.url === "string" ? config.url : "";
  const skipAuth =
    url.includes("/auth/login") || url.includes("/auth/register");

  const token = localStorage.getItem(TOKEN_KEY);
  if (token && !skipAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Bust browser HTTP cache on GETs so list/detail refetches after mutations are fresh.
axiosInstance.interceptors.request.use((config) => {
  if ((config.method ?? "get").toLowerCase() !== "get") {
    return config;
  }

  config.headers.set("Cache-Control", "no-store");
  config.headers.set("Pragma", "no-cache");

  const prev = config.params;
  const base =
    prev !== undefined && typeof prev === "object" && !Array.isArray(prev)
      ? (prev as Record<string, unknown>)
      : {};
  config.params = { ...base, _refineNocache: Date.now() };

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customError: HttpError = {
      ...error,
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    };

    return Promise.reject(customError);
  }
);
