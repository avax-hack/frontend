'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { useAccount, useAccountEffect, useSwitchChain } from 'wagmi'
import { useAuth } from '@/features/auth/hooks'
import { useAuthStore } from '@/stores/authStore'
import { defaultChain } from '@/lib/constants'

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const { address, chainId, isConnected } = useAccount()
  const { switchChain } = useSwitchChain()
  const { restoreSession, logout } = useAuth()
  const clearAccount = useAuthStore((s) => s.clearAccount)
  const restoredRef = useRef(false)
  const lastAddressRef = useRef<string | undefined>(undefined)
  const lastChainIdRef = useRef<number | undefined>(undefined)

  // Force switch to default chain if on wrong network
  useEffect(() => {
    if (isConnected && chainId && chainId !== defaultChain.id) {
      switchChain({ chainId: defaultChain.id })
    }
  }, [isConnected, chainId, switchChain])

  // Restore session on mount if wallet is connected
  useEffect(() => {
    if (isConnected && !restoredRef.current) {
      restoredRef.current = true
      lastAddressRef.current = address
      lastChainIdRef.current = chainId
      restoreSession()
    }
  }, [isConnected, address, chainId, restoreSession])

  // Detect account or chain change while connected
  useEffect(() => {
    if (!isConnected || !address) return

    const addressChanged = lastAddressRef.current && address !== lastAddressRef.current
    const chainChanged = lastChainIdRef.current && chainId !== lastChainIdRef.current

    if (addressChanged || chainChanged) {
      clearAccount()
      restoredRef.current = false
      lastAddressRef.current = address
      lastChainIdRef.current = chainId
    }
  }, [isConnected, address, chainId, clearAccount])

  // Handle wallet connect/disconnect lifecycle
  useAccountEffect({
    onConnect: () => {
      restoredRef.current = false
    },
    onDisconnect: () => {
      restoredRef.current = false
      lastAddressRef.current = undefined
      lastChainIdRef.current = undefined
      logout()
    },
  })

  return <>{children}</>
}
