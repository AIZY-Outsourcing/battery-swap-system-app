import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";
import { ENV } from "../../config/env";

const API_BASE_URL = ENV.API_BASE_URL;
const TOKEN_KEY = "BSS_AUTH_TOKEN";
const REFRESH_TOKEN_KEY = "BSS_REFRESH_TOKEN";

// Enable verbose API logs in development or when explicitly toggled via env
const DEBUG_API_LOGS =
  String(process.env.EXPO_PUBLIC_DEBUG_API_LOGS).toLowerCase() === "true" ||
  (typeof __DEV__ !== "undefined" && __DEV__) ||
  process.env.NODE_ENV !== "production";

function toJSONSafe(value: any, maxLen = 500): string | undefined {
  try {
    if (value == null) return undefined;
    // Avoid logging giant payloads or binary bodies
    if (
      typeof FormData !== "undefined" &&
      typeof value === "object" &&
      value instanceof FormData
    ) {
      const keys: string[] = [];
      // React Native FormData doesn't support iteration in all envs; best-effort
      // @ts-ignore
      if (typeof value.getParts === "function") {
        // @ts-ignore
        const parts = value.getParts();
        for (const p of parts) {
          if (p && p.fieldName) keys.push(p.fieldName);
        }
      }
      return `FormData{keys:${JSON.stringify(keys).slice(0, maxLen)}}`;
    }
    const str =
      typeof value === "string" ? value : JSON.stringify(value, null, 0);
    return str.length > maxLen ? str.slice(0, maxLen) + "…" : str;
  } catch {
    return undefined;
  }
}

function sanitizeHeaders(headers: any) {
  if (!headers) return headers;
  const cloned = { ...(headers as any) };
  if (cloned.Authorization) cloned.Authorization = "Bearer ***";
  if (cloned.authorization) cloned.authorization = "Bearer ***";
  if (cloned["x-api-key"]) cloned["x-api-key"] = "***";
  return cloned;
}

export async function getSecureToken(): Promise<string | null> {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    return token || null;
  } catch {
    return null;
  }
}

export async function setSecureToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    // noop
  }
}

export async function setRefreshToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch {}
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    return token || null;
  } catch {
    return null;
  }
}

export async function clearRefreshToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch {}
}

export async function clearSecureToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    // noop
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
});

if (DEBUG_API_LOGS) {
  try {
    // eslint-disable-next-line no-console
    console.log("[api] client init", { baseURL: API_BASE_URL });
  } catch {}
}

let isRefreshing = false;
let refreshQueue: {
  resolve: (token?: string) => void;
  reject: (err: any) => void;
}[] = [];

function enqueueRefresh() {
  return new Promise<string | undefined>((resolve, reject) => {
    refreshQueue.push({ resolve, reject });
  });
}

function flushRefreshQueue(error: any, token?: string) {
  refreshQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  refreshQueue = [];
}

async function performTokenRefresh(): Promise<string | undefined> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return undefined;
  try {
    if (DEBUG_API_LOGS) {
      try {
        // eslint-disable-next-line no-console
        console.log("[api] ⇢ POST", `${API_BASE_URL}/auth/refresh`, {
          refresh_token: "***",
        });
      } catch {}
    }
    const res = await axios.post(API_BASE_URL + "/auth/refresh", {
      refresh_token: refreshToken,
    });
    if (DEBUG_API_LOGS) {
      try {
        // eslint-disable-next-line no-console
        console.log(
          "[api] ⇠ POST",
          `${API_BASE_URL}/auth/refresh`,
          "→",
          res.status
        );
      } catch {}
    }
    const newAccess =
      res.data?.data?.access_token || res.data?.access_token || res.data?.token;
    const newRefresh = res.data?.data?.refresh_token || res.data?.refresh_token;
    if (newAccess) await setSecureToken(newAccess);
    if (newRefresh) await setRefreshToken(newRefresh);
    return newAccess;
  } catch (err) {
    if (DEBUG_API_LOGS) {
      try {
        const status = (err as any)?.response?.status;
        // eslint-disable-next-line no-console
        console.log(
          "[api] ✖ POST",
          `${API_BASE_URL}/auth/refresh`,
          status || "NETWORK"
        );
      } catch {}
    }
    await clearSecureToken();
    await clearRefreshToken();
    return undefined;
  }
}

// Attach token & log outbound request
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getSecureToken();
  if (token) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    } as any;
  }

  // Mark start time for duration measurement
  (config as any).metadata = { startTime: Date.now() };

  if (DEBUG_API_LOGS) {
    try {
      const method = (config.method || "GET").toUpperCase();
      const url = `${config.baseURL || ""}${config.url || ""}`;
      // eslint-disable-next-line no-console
      console.log("[api] ⇢", method, url, {
        params: config.params,
        data: toJSONSafe(config.data),
        headers: sanitizeHeaders(config.headers),
      });
    } catch {}
  }

  return config;
});

// Basic response normalization
api.interceptors.response.use(
  (res) => {
    // Attempt to parse JSON bodies that arrive as strings (e.g., wrong content-type)
    try {
      if (typeof res.data === "string") {
        const maybe = res.data.trim();
        if (
          (maybe.startsWith("{") && maybe.endsWith("}")) ||
          (maybe.startsWith("[") && maybe.endsWith("]"))
        ) {
          res.data = JSON.parse(maybe);
          if (DEBUG_API_LOGS) {
            // eslint-disable-next-line no-console
            console.log("[api] (normalized) parsed string body to JSON");
          }
        }
      } else if (res.data && typeof (res.data as any).data === "string") {
        const maybe = String((res.data as any).data).trim();
        if (
          (maybe.startsWith("{") && maybe.endsWith("}")) ||
          (maybe.startsWith("[") && maybe.endsWith("]"))
        ) {
          res.data = JSON.parse(maybe);
          if (DEBUG_API_LOGS) {
            // eslint-disable-next-line no-console
            console.log("[api] (normalized) parsed nested string body to JSON");
          }
        }
      }
    } catch {}
    if (DEBUG_API_LOGS) {
      const cfg: any = res.config || {};
      const start = cfg.metadata?.startTime || Date.now();
      const duration = Date.now() - start;
      try {
        const method = (res.config?.method || "GET").toUpperCase();
        const url = `${res.config?.baseURL || ""}${res.config?.url || ""}`;
        // eslint-disable-next-line no-console
        console.log(
          "[api] ⇠",
          `${method} ${url}`,
          `→ ${res.status} (${duration}ms)`,
          { data: toJSONSafe(res.data) }
        );
      } catch {}
    }
    return res;
  },
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    if (DEBUG_API_LOGS) {
      const cfg: any = error.config || {};
      const start = cfg.metadata?.startTime || Date.now();
      const duration = Date.now() - start;
      try {
        const method = (error.config?.method || "GET").toUpperCase();
        const url = `${error.config?.baseURL || ""}${error.config?.url || ""}`;
        // eslint-disable-next-line no-console
        console.log(
          "[api] ⇠",
          `${method} ${url}`,
          `✖ ${status || "NETWORK"} (${duration}ms)`,
          {
            message: error.message,
            response: toJSONSafe(error.response?.data),
          }
        );
      } catch {}
    }

    // Only attempt refresh for 401, not already retried, and we have a refresh token
    if (status === 401 && !original?._retry) {
      original._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await performTokenRefresh();
          flushRefreshQueue(null, newToken);
          return api(original);
        } catch (e) {
          flushRefreshQueue(e, undefined);
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      } else {
        try {
          const newToken = await enqueueRefresh();
          if (newToken) {
            (original.headers =
              original.headers || {}).Authorization = `Bearer ${newToken}`;
          }
          return api(original);
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
