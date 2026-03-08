'use client'

import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAuthStore } from '@/stores/authStore'
import { WalletIcon } from 'lucide-react'

interface WalletRequiredProps {
  children: React.ReactNode
}

export function WalletRequired({ children }: WalletRequiredProps) {
  const { isConnected } = useAccount()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <div className="text-muted-foreground" aria-hidden="true">
          <WalletIcon className="size-12" />
        </div>
        <h2 className="text-xl font-bold">Connect Your Wallet</h2>
        <p className="text-sm text-muted-foreground leading-[1.2]">
          Connect your wallet to view your portfolio
        </p>
        <ConnectButton />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <div className="text-muted-foreground" aria-hidden="true">
          <WalletIcon className="size-12" />
        </div>
        <h2 className="text-xl font-bold">Sign In Required</h2>
        <p className="text-sm text-muted-foreground leading-[1.2]">
          Please sign in with your wallet to view your portfolio
        </p>
        <ConnectButton />
      </div>
    )
  }

  return <>{children}</>
}
