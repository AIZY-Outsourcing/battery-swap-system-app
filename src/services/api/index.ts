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
    const res = await axios.post(API_BASE_URL + "/auth/refresh", {
      refresh_token: refreshToken,
    });
    const newAccess =
      res.data?.data?.access_token || res.data?.access_token || res.data?.token;
    const newRefresh = res.data?.data?.refresh_token || res.data?.refresh_token;
    if (newAccess) await setSecureToken(newAccess);
    if (newRefresh) await setRefreshToken(newRefresh);
    return newAccess;
  } catch (err) {
    await clearSecureToken();
    await clearRefreshToken();
    return undefined;
  }
}

// Attach token
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getSecureToken();
  if (token) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    } as any;
  }
  return config;
});

// Basic response normalization
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

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
