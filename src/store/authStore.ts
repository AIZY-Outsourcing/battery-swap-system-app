import { create } from "zustand";
import type { User } from "../types";
import AuthService from "../services/auth/AuthService";

type AuthState = {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User | null) => void;
  clear: () => void;
  logout: () => Promise<void>;
  hydrated?: boolean; // future flag if we hydrate from storage
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
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
}));
