import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  address: string | null;
  setAuthenticated: (address: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  address: null,
  setAuthenticated: (address) => set({ isAuthenticated: true, address }),
  clearAuth: () => set({ isAuthenticated: false, address: null }),
}));
