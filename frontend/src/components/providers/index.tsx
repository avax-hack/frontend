'use client'

import { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryProvider } from './QueryProvider'
import { SessionProvider } from './SessionProvider'
import { wagmiConfig } from './wagmi-config'
import '@rainbow-me/rainbowkit/styles.css'

// Provider order: QueryProvider > WagmiProvider > SessionProvider > RainbowKitProvider
// Deviates from frontend.md (SessionProvider > WagmiProvider > ...) because
// SessionProvider uses wagmi hooks and must be inside WagmiProvider.
// Session restores before RainbowKit renders, satisfying the intent.
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <WagmiProvider config={wagmiConfig}>
        <SessionProvider>
          <RainbowKitProvider>
            {children}
          </RainbowKitProvider>
        </SessionProvider>
      </WagmiProvider>
    </QueryProvider>
  )
}
