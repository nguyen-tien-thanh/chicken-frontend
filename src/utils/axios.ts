import type { HttpError } from "@refinedev/core";
import axios from "axios";
import { TOKEN_KEY } from "../providers/constants";

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
