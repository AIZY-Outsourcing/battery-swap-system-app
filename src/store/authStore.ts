import { create } from "zustand";
import type { User } from "../types";
import AuthService from "../services/auth/AuthService";
import { getSecureToken } from "../services/api";

type AuthState = {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User | null) => void;
  clear: () => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,
  setAuth: (token, user) => set({ token, user }),
  setUser: (user) => set({ user }),
  clear: () => set({ token: null, user: null }),
  logout: async () => {
    try {
      await AuthService.logout();
    } finally {
      set({ token: null, user: null });
    }
  },
  hydrate: async () => {
    try {
      console.log("🔄 [authStore] Starting hydration...");
      const [token, user] = await Promise.all([
        getSecureToken(),
        AuthService.getCurrentUser(),
      ]);

      console.log("🔍 [authStore] Hydration results:", {
        hasToken: !!token,
        hasUser: !!user,
        userId: user?.id,
      });

      if (token && user) {
        set({ token, user, hydrated: true });
        console.log("✅ [authStore] Hydration successful - user logged in");
      } else {
        set({ token: null, user: null, hydrated: true });
        console.log(
          "❌ [authStore] Hydration complete - no stored credentials"
        );
      }
    } catch (error) {
      console.error("⚠️ [authStore] Failed to hydrate auth state:", error);
      set({ token: null, user: null, hydrated: true });
    }
  },
}));
