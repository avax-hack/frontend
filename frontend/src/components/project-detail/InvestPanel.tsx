'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { IProjectData } from '@/types/project'

interface InvestPanelProps {
  project: IProjectData
}

export function InvestPanel({ project }: InvestPanelProps) {
  const { market_info } = project
  const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [amount, setAmount] = useState('')

  const isActive = market_info.status === 'active'
  const isFundingComplete = market_info.status === 'completed' || market_info.funded_percent >= 100
  const isFailed = market_info.status === 'failed'
  const isFunding = market_info.status === 'funding' && !isFundingComplete && !isActive

  const numericAmount = parseFloat(amount)
  const isValidAmount = !isNaN(numericAmount) && numericAmount >= 10

  function handleCommitFunds() {
    toast('Coming in Phase 3', {
      description: 'On-chain investment will be available soon.',
    })
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
        {/* D-12: Wallet not connected */}
        {!isConnected && (
          <div className="flex w-full items-center justify-between">
            <p className="text-sm text-muted-foreground">Connect wallet to invest</p>
            <Button
              onClick={openConnectModal}
              size="lg"
              aria-label="Connect Wallet"
            >
              Connect Wallet
            </Button>
          </div>
        )}

        {/* D-13: Funding complete */}
        {isConnected && isFundingComplete && (
          <div className="flex w-full items-center justify-between">
            <p className="text-sm text-muted-foreground">This project has reached its funding goal</p>
            <Button disabled size="lg" aria-label="Funding Complete">
              Funding Complete
            </Button>
          </div>
        )}

        {/* Failed project — Claim Refund (disabled, Phase 3) */}
        {isConnected && isFailed && (
          <div className="flex w-full items-center justify-between">
            <p className="text-sm text-muted-foreground">This project has failed</p>
            <Button disabled variant="destructive" size="lg" aria-label="Claim Refund">
              Claim Refund
            </Button>
          </div>
        )}

        {/* Active project — milestone phase, no more investment */}
        {isConnected && isActive && (
          <div className="flex w-full items-center justify-between">
            <p className="text-sm text-muted-foreground">This project is in its active milestone phase</p>
            <Button disabled size="lg" aria-label="Funding Closed">
              Funding Closed
            </Button>
          </div>
        )}

        {/* D-10: Active funding */}
        {isConnected && isFunding && (
          <div className="flex w-full items-center gap-4">
            <div className="flex flex-1 items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground" aria-hidden="true">$</span>
              <input
                type="number"
                inputMode="decimal"
                name="invest-amount"
                min={10}
                step={10}
                autoComplete="off"
                spellCheck={false}
                placeholder="0.00 (min $10)…"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-label="Investment amount in USD"
                className="h-10 w-full rounded-md border bg-background px-3 text-base outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <Button
              size="lg"
              disabled={!isValidAmount}
              onClick={handleCommitFunds}
              aria-label="Commit Funds"
            >
              Commit Funds
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
