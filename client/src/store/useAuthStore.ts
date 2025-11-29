import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type User } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData: User) => {
        // Zustand persist otomatik kaydediyor, manuel kaydetmeye gerek yok
        set(() => ({ user: userData, isAuthenticated: true }));
      },
      logout: () => {
        // Zustand persist otomatik temizliyor
        set(() => ({ user: null, isAuthenticated: false }));
      },
      initializeAuth: () => {
        // Zustand persist otomatik yüklüyor, özel bir şey yapmaya gerek yok
        // Bu fonksiyon artık gerekli değil ama geriye dönük uyumluluk için tutabiliriz
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
