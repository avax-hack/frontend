'use client'

import { ReactNode, useEffect } from 'react'
import { useAccount, useAccountEffect, useSwitchChain } from 'wagmi'
import { useAuth } from '@/features/auth/hooks'
import { defaultChain } from '@/lib/constants'

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const { chainId, isConnected } = useAccount()
  const { switchChain } = useSwitchChain()
  const { logout } = useAuth()

  // Force switch to default chain if on wrong network
  useEffect(() => {
    if (isConnected && chainId && chainId !== defaultChain.id) {
      switchChain({ chainId: defaultChain.id })
    }
  }, [isConnected, chainId, switchChain])

  // Handle wallet disconnect
  useAccountEffect({
    onDisconnect: () => {
      logout()
    },
  })

  return <>{children}</>
}
