import { create } from 'zustand'
import type { IAccountInfo } from '@/types/common'

interface AuthState {
  account: IAccountInfo | null
  isAuthenticated: boolean
  setAccount: (account: IAccountInfo) => void
  clearAccount: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  account: null,
  isAuthenticated: false,
  setAccount: (account) => set({ account, isAuthenticated: true }),
  clearAccount: () => set({ account: null, isAuthenticated: false }),
}))
