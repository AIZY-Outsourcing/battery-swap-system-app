import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.bss-app.com";
const TOKEN_KEY = "BSS_AUTH_TOKEN";

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

export async function clearSecureToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    // noop
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Attach token
api.interceptors.request.use(async (config) => {
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
  (err) => Promise.reject(err)
);

export default api;
