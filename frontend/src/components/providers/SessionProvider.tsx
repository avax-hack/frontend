'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { useAccount, useAccountEffect } from 'wagmi'
import { useAuth } from '@/features/auth/hooks'
import { useAuthStore } from '@/stores/authStore'

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const { address, isConnected } = useAccount()
  const { restoreSession, logout } = useAuth()
  const clearAccount = useAuthStore((s) => s.clearAccount)
  const restoredRef = useRef(false)
  const lastAddressRef = useRef<string | undefined>(undefined)

  // Restore session on mount if wallet is connected
  useEffect(() => {
    if (isConnected && !restoredRef.current) {
      restoredRef.current = true
      lastAddressRef.current = address
      restoreSession()
    }
  }, [isConnected, address, restoreSession])

  // Detect account change (address switch while connected)
  useEffect(() => {
    if (isConnected && address && lastAddressRef.current && address !== lastAddressRef.current) {
      // Account switched — clear old session, require re-auth
      clearAccount()
      restoredRef.current = false
      lastAddressRef.current = address
    }
  }, [isConnected, address, clearAccount])

  // Handle wallet connect/disconnect lifecycle
  useAccountEffect({
    onConnect: () => {
      restoredRef.current = false
    },
    onDisconnect: () => {
      restoredRef.current = false
      lastAddressRef.current = undefined
      logout()
    },
  })

  return <>{children}</>
}
