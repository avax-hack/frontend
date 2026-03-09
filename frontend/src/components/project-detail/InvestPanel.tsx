'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { toast } from 'sonner'
import { LoaderIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProfile, useAuth } from '@/features/auth/hooks'
import { isUserRejection } from '@/lib/errors'
import { useUsdcBalance, useRefund, useTokenBalance } from '@/features/contracts'
import { IS_MOCK } from '@/lib/mock'
import { SNOWTRACE_URL } from '@/lib/constants'
import { InvestModal } from './InvestModal'
import type { IProjectData } from '@/types/project'
import { getAddress } from 'viem'

interface InvestPanelProps {
  project: IProjectData
}

export function InvestPanel({ project }: InvestPanelProps) {
  const { market_info } = project
  const { isConnected, address } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { isAuthenticated } = useProfile()
  const { login } = useAuth()
  const queryClient = useQueryClient()
  const [amount, setAmount] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  // Refund hooks (unconditional, per React rules)
  const refund = useRefund()
  const projectTokenAddress = getAddress(project.project_info.project_id)
  const { data: projectTokenBalanceRaw } = useTokenBalance(projectTokenAddress, address)
  const projectTokenBalanceData = projectTokenBalanceRaw as bigint | undefined
  const [isMockRefunding, setIsMockRefunding] = useState(false)

  // Derived refund states
  const isRefundBusy = IS_MOCK
    ? isMockRefunding
    : refund.step === 'executing' || refund.step === 'waiting-execution'
  const isRefundSuccess = !IS_MOCK && refund.step === 'success'
  const hasNoTokenBalance = !IS_MOCK && (!projectTokenBalanceData || projectTokenBalanceData === BigInt(0))

  // USDC balance (real mode only; disabled when IS_MOCK)
  const { data: usdcBalanceRaw } = useUsdcBalance(address)
  const formattedBalance = usdcBalanceRaw !== undefined
    ? (Number(usdcBalanceRaw) / 1e6).toFixed(2)
    : undefined

  // Use a ref to read latest isConnected in async callback
  const isConnectedRef = useRef(isConnected)
  useEffect(() => { isConnectedRef.current = isConnected }, [isConnected])

  const isActive = market_info.status === 'active'
  const isFundingComplete = market_info.status === 'completed' || market_info.funded_percent >= 100
  const isFailed = market_info.status === 'failed'
  const isFunding = market_info.status === 'funding' && !isFundingComplete && !isActive

  const numericAmount = parseFloat(amount)
  const remainingUsdc = Math.max(
    0,
    Number(market_info.target_raise) - Number(market_info.total_committed),
  )
  const usdcBalance = formattedBalance !== undefined ? parseFloat(formattedBalance) : Infinity
  const maxInvestable = Math.min(remainingUsdc, usdcBalance)
  const exceedsRemaining = !isNaN(numericAmount) && numericAmount > remainingUsdc
  const exceedsBalance = !IS_MOCK && !isNaN(numericAmount) && numericAmount > usdcBalance
  const isValidAmount = !isNaN(numericAmount) && numericAmount >= 10 && !exceedsRemaining && !exceedsBalance

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

    if (IS_MOCK) {
      if (isMockRefunding) return
      setIsMockRefunding(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 2000))
        if (!isConnectedRef.current) {
          toast.error('Wallet disconnected', {
            description: 'Please reconnect and try again.',
          })
          return
        }
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
        setIsMockRefunding(false)
      }
      return
    }

    // Real refund flow — refund all project tokens
    const tokenBalance = projectTokenBalanceData
    if (!tokenBalance || tokenBalance === BigInt(0)) return

    const refundHash = await refund.execute(projectTokenAddress, tokenBalance)
    if (refundHash) {
      queryClient.invalidateQueries({ queryKey: ['readContract'] })
    }
  }, [isAuthenticated, login, isMockRefunding, refund, projectTokenBalanceData, projectTokenAddress])

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
              <div className="flex items-center gap-3">
                {!IS_MOCK && refund.txHash && (
                  <a
                    href={`${SNOWTRACE_URL}/tx/${refund.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground underline"
                  >
                    View on Snowtrace ↗
                  </a>
                )}
                <Button
                  variant="destructive"
                  size="lg"
                  aria-label="Claim Refund"
                  disabled={isRefundBusy || isRefundSuccess || hasNoTokenBalance}
                  onClick={handleClaimRefund}
                >
                  {isRefundBusy && <LoaderIcon className="size-4 animate-spin" aria-hidden="true" />}
                  {isRefundBusy ? 'Claiming…' : isRefundSuccess ? 'Refund Claimed ✓' : 'Claim Refund'}
                </Button>
              </div>
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
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground" aria-hidden="true">$</span>
                  <Input
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
                    className="h-10"
                  />
                </div>
                <div className="flex items-center gap-2 pl-5">
                  {/* USDC balance (real mode only) */}
                  {!IS_MOCK && formattedBalance !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      Balance: ${formattedBalance} USDC
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    (Remaining: ${remainingUsdc.toLocaleString(undefined, { maximumFractionDigits: 2 })})
                  </span>
                  {maxInvestable >= 10 && (
                    <button
                      type="button"
                      className="text-xs font-medium text-primary hover:underline"
                      onClick={() => setAmount(String(Math.floor(maxInvestable * 100) / 100))}
                    >
                      Max
                    </button>
                  )}
                </div>
                {exceedsRemaining && (
                  <span className="pl-5 text-xs text-red-500">
                    Exceeds remaining funding amount (${remainingUsdc.toLocaleString(undefined, { maximumFractionDigits: 2 })})
                  </span>
                )}
                {!exceedsRemaining && exceedsBalance && (
                  <span className="pl-5 text-xs text-red-500">
                    Exceeds your USDC balance (${formattedBalance})
                  </span>
                )}
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
