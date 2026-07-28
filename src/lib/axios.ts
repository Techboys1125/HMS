export const API_BASE_URL =
  (import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  "https://safe-hands-hms-backend.onrender.com";

export interface ApiResponseData<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export class ApiError extends Error {
  response?: {
    status: number;
    data?: unknown;
  };
  config?: unknown;
  isAxiosError?: boolean;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.isAxiosError = true;
    if (status) {
      this.response = { status, data };
    }
  }
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

async function customFetch<T = unknown>(
  url: string,
  options: RequestInit = {},
): Promise<ApiResponseData<T>> {
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  const token = localStorage.getItem("accessToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(fullUrl, {
      ...options,
      headers,
    });
  } catch (networkError: unknown) {
    const errorObj = networkError as { message?: string } | undefined;
    throw new ApiError(
      "Unable to connect to the server. Please check your network connection and try again.",
      0,
      { originalError: errorObj?.message },
    );
  }

  let responseData: unknown;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }

  if (!response.ok) {
    // 401 Token Refresh Logic (exclude login and public auth endpoints)
    const isPublicAuthEndpoint =
      url.includes("/api/v1/auth/login") ||
      url.includes("/api/v1/auth/patient/register") ||
      url.includes("/api/v1/auth/forgot-password") ||
      url.includes("/api/v1/auth/verify-reset-otp") ||
      url.includes("/api/v1/auth/reset-password") ||
      url.includes("/api/v1/auth/refresh");

    if (response.status === 401 && !isPublicAuthEndpoint) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          return customFetch<T>(url, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            },
          });
        });
      }

      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const refreshRes = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        const refreshData = await refreshRes.json();
        const newAccessToken =
          refreshData?.data?.accessToken || refreshData?.accessToken;

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          processQueue(null, newAccessToken);
          return customFetch<T>(url, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
        } else {
          throw new Error("Failed to retrieve new access token");
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        console.error("[Auth] Session expired. Please log in again.");
        throw new ApiError(
          "Session expired. Please log in again.",
          401,
          responseData,
        );
      } finally {
        isRefreshing = false;
      }
    }

    if (response.status === 403) {
      if (
        typeof responseData === "object" &&
        responseData !== null &&
        "message" in responseData &&
        typeof (responseData as { message: unknown }).message === "string" &&
        (responseData as { message: string }).message.includes(
          "Password change required",
        )
      ) {
        localStorage.setItem("force_change_password", "true");
      }
    }

    const errorMsg =
      (typeof responseData === "object" &&
        responseData !== null &&
        "message" in responseData &&
        typeof (responseData as { message: unknown }).message === "string" &&
        (responseData as { message: string }).message) ||
      response.statusText ||
      `Request failed with status ${response.status}`;

    throw new ApiError(errorMsg, response.status, responseData);
  }

  const responseHeaders: Record<string, string> = {};
  response.headers.forEach((val, key) => {
    responseHeaders[key] = val;
  });

  return {
    data: responseData as T,
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  };
}

export const apiClient = {
  get: <T = unknown>(url: string, config: RequestInit = {}) =>
    customFetch<T>(url, { ...config, method: "GET" }),

  post: <T = unknown>(url: string, body?: unknown, config: RequestInit = {}) =>
    customFetch<T>(url, {
      ...config,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = unknown>(url: string, body?: unknown, config: RequestInit = {}) =>
    customFetch<T>(url, {
      ...config,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = unknown>(url: string, body?: unknown, config: RequestInit = {}) =>
    customFetch<T>(url, {
      ...config,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = unknown>(url: string, config: RequestInit = {}) =>
    customFetch<T>(url, { ...config, method: "DELETE" }),
};

export const axios = {
  isAxiosError: (err: unknown): err is ApiError => {
    return (
      typeof err === "object" &&
      err !== null &&
      (("isAxiosError" in err &&
        (err as { isAxiosError: boolean }).isAxiosError === true) ||
        err instanceof ApiError)
    );
  },
};

export default apiClient;
