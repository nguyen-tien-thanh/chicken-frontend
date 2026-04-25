import { TOKEN_KEY } from '@/providers/constants';
import type { HttpError } from '@refinedev/core';
import axios from 'axios';

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const url = typeof config.url === 'string' ? config.url : '';
  const skipAuth =
    url.includes('/auth/login') || url.includes('/auth/register');

  const token = localStorage.getItem(TOKEN_KEY);
  if (token && !skipAuth) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

// Disable caching for mutating requests so responses are never stale.
axiosInstance.interceptors.request.use((config) => {
  const method = (config.method ?? 'get').toLowerCase();
  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    config.headers['Cache-Control'] = 'no-store';
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
  },
);
