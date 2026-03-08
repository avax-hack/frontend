'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { toast } from 'sonner'
import { LoaderIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks'
import { isUserRejection } from '@/lib/errors'
import { InvestModal } from './InvestModal'
import type { IProjectData } from '@/types/project'

interface InvestPanelProps {
  project: IProjectData
}

export function InvestPanel({ project }: InvestPanelProps) {
  const { market_info } = project
  const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { isAuthenticated, login } = useAuth()
  const [amount, setAmount] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [isRefunding, setIsRefunding] = useState(false)

  // Use a ref to read latest isConnected in async callback
  const isConnectedRef = useRef(isConnected)
  useEffect(() => { isConnectedRef.current = isConnected }, [isConnected])

  const isActive = market_info.status === 'active'
  const isFundingComplete = market_info.status === 'completed' || market_info.funded_percent >= 100
  const isFailed = market_info.status === 'failed'
  const isFunding = market_info.status === 'funding' && !isFundingComplete && !isActive

  const numericAmount = parseFloat(amount)
  const isValidAmount = !isNaN(numericAmount) && numericAmount >= 10

  const handleCommitFunds = useCallback(async () => {
    if (!isAuthenticated) {
      await login()
      // After login, user needs to click again (state will update)
      return
    }
    setModalOpen(true)
  }, [isAuthenticated, login])

  const handleInvestSuccess = useCallback(() => {
    setAmount('')
  }, [])

  const handleClaimRefund = useCallback(async () => {
    if (!isAuthenticated) {
      await login()
      return
    }
    if (isRefunding) return // double-submit prevention

    setIsRefunding(true)
    try {
      // Mock refund TX
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Check if still connected after TX
      if (!isConnectedRef.current) {
        toast.error('Wallet disconnected', {
          description: 'Please reconnect and try again.',
        })
        return
      }

      // TODO: Replace with real contract call
      toast.success('Refund claimed successfully!', {
        description: 'Your funds have been returned to your wallet.',
      })
    } catch (error: unknown) {
      if (isUserRejection(error)) {
        toast.error('Transaction rejected')
      } else {
        toast.error('Refund failed', { description: 'Please try again.' })
      }
    } finally {
      setIsRefunding(false)
    }
  }, [isAuthenticated, login, isRefunding])

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
          {/* D-12: Wallet not connected */}
          {!isConnected && (
            <div className="flex w-full items-center justify-between">
              <p className="text-sm text-muted-foreground">Connect wallet to invest</p>
              <Button onClick={openConnectModal} size="lg" aria-label="Connect Wallet">
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

          {/* Failed project — Claim Refund */}
          {isConnected && isFailed && (
            <div className="flex w-full items-center justify-between">
              <p className="text-sm text-muted-foreground">This project has failed</p>
              <Button
                variant="destructive"
                size="lg"
                aria-label="Claim Refund"
                disabled={isRefunding}
                onClick={handleClaimRefund}
              >
                {isRefunding && <LoaderIcon className="size-4 animate-spin" aria-hidden="true" />}
                {isRefunding ? 'Claiming…' : 'Claim Refund'}
              </Button>
            </div>
          )}

          {/* Active project — milestone phase */}
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

      {/* Investment confirmation modal */}
      {isFunding && isValidAmount && (
        <InvestModal
          project={project}
          amount={numericAmount}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSuccess={handleInvestSuccess}
        />
      )}
    </>
  )
}
