import type { AuthProvider, HttpError } from "@refinedev/core";

import { axiosInstance } from "@/utils/axios";
import { TOKEN_KEY } from "./constants";

const apiUrl = import.meta.env.VITE_API_URL as string;

type PermissionDto = { id: number; path: string; method: string };

type ProfileResponse = {
  id: number;
  email: string;
  name?: string | null;
  role?: { rolesPermissions: Array<{ permission: PermissionDto }> };
};

function authErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const m = (error as HttpError).message;
    if (Array.isArray(m)) return m.join(", ");
    if (typeof m === "string") return m;
  }
  return "Yêu cầu thất bại";
}

function flattenPermissions(user: ProfileResponse): string[] {
  const pairs = user.role?.rolesPermissions ?? [];
  return pairs.map(
    ({ permission }) => `${permission.method}:${permission.path}`,
  );
}

export const authProvider: AuthProvider = {
  login: async ({ username, email, password }) => {
    const loginEmail = email ?? username;
    if (!loginEmail || !password) {
      return {
        success: false,
        error: {
          name: "Đăng nhập thất bại",
          message: "Email hoặc mật khẩu không hợp lệ",
        },
      };
    }

    try {
      const { data } = await axiosInstance.post<{
        user: ProfileResponse;
        token: string;
      }>(`${apiUrl}/auth/login`, { email: loginEmail, password });

      localStorage.setItem(TOKEN_KEY, data.token);
      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "Đăng nhập thất bại",
          message: authErrorMessage(error),
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return { authenticated: true };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },

  register: async ({ email, password, ...rest }) => {
    if (!email || !password) {
      return {
        success: false,
        error: {
          name: "Đăng ký thất bại",
          message: "Email và mật khẩu là bắt buộc",
        },
      };
    }

    try {
      await axiosInstance.post(`${apiUrl}/auth/register`, {
        email,
        password,
        ...rest,
      });
      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "Đăng ký thất bại",
          message: authErrorMessage(error),
        },
      };
    }
  },

  getPermissions: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const { data } = await axiosInstance.get<ProfileResponse>(
        `${apiUrl}/auth/profile`,
      );
      return flattenPermissions(data);
    } catch {
      return null;
    }
  },

  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const { data } = await axiosInstance.get<ProfileResponse>(
        `${apiUrl}/auth/profile`,
      );
      return {
        id: data.id,
        name: data.name ?? data.email,
      };
    } catch (error) {
      if ((error as unknown as HttpError)?.statusCode === 401) {
        await authProvider.logout({ redirectTo: "/login" });
        return null;
      }
      throw new Error("Không thể lấy thông tin người dùng");
    }
  },

  onError: async (error) => {
    console.error(error);
    const status = (error as HttpError)?.statusCode;
    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      return { error, logout: true, redirectTo: "/login" };
    }
    return { error };
  },
};
