'use client'

import { use, useState } from 'react'
import { getAddress } from 'viem'
import { useTokenDetail, useChartData, useSwapHistory, useTokenHolders } from '@/features/trading/hooks'
import { useTradingSubscription } from '@/hooks/useWebSocket'
import type { ChartResolution } from '@/features/trading/types'
import { TokenHeader } from '@/components/trading/TokenHeader'
import { MarketStats } from '@/components/trading/MarketStats'
import { TradingChart } from '@/components/trading/TradingChart'
import { ChartIntervalSelector } from '@/components/trading/ChartIntervalSelector'
import { TradePanel } from '@/components/trading/TradePanel'
import { TradesTable } from '@/components/trading/TradesTable'
import { HoldersTable } from '@/components/trading/HoldersTable'
import { BondingCurveCard } from '@/components/trading/BondingCurveCard'
import { MilestoneStatusCard } from '@/components/trading/MilestoneStatusCard'
import { TokenInfoCard } from '@/components/trading/TokenInfoCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface TokenDetailPageProps {
  params: Promise<{ tokenId: string }>
}

export default function TokenDetailPage({ params }: TokenDetailPageProps) {
  const { tokenId: rawTokenId } = use(params)
  const tokenId = getAddress(rawTokenId)
  useTradingSubscription(tokenId)
  const [interval, setInterval_] = useState<ChartResolution>('1m')

  const { data: token, isLoading: tokenLoading, isError: tokenError } = useTokenDetail(tokenId)
  const { data: chartData } = useChartData(tokenId, interval)
  const { data: swapData, isLoading: swapsLoading } = useSwapHistory(tokenId)
  const { data: holdersData, isLoading: holdersLoading } = useTokenHolders(tokenId)

  if (tokenLoading) {
    return (
      <div className="px-4 py-6 mx-auto max-w-7xl flex flex-col gap-4">
        {/* Header skeleton */}
        <Skeleton className="h-10 w-96" />
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
        {/* Main + sidebar skeleton */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <Skeleton className="h-[400px] rounded-xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Skeleton className="h-[250px] rounded-xl" />
              <Skeleton className="h-[250px] rounded-xl" />
              <Skeleton className="h-[250px] rounded-xl" />
            </div>
          </div>
          <div className="w-full lg:w-80 flex flex-col gap-4">
            <Skeleton className="h-[300px] rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-[160px] rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (tokenError) {
    return (
      <div className="px-4 py-6 mx-auto max-w-7xl flex flex-col items-center gap-4">
        <p className="text-xl font-bold leading-[1.2]">Something went wrong</p>
        <p className="text-sm text-muted-foreground leading-[1.2]">Failed to load token data.</p>
        <Button asChild variant="outline">
          <Link href="/trading">Back to Trading</Link>
        </Button>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="px-4 py-6 mx-auto max-w-7xl flex flex-col items-center gap-4">
        <p className="text-xl font-bold leading-[1.2]">Token not found</p>
        <Button asChild variant="outline">
          <Link href="/trading">Back to Trading</Link>
        </Button>
      </div>
    )
  }

  const showBondingCurve = !token.token_info.is_graduated

  return (
    <div className="px-4 py-6 mx-auto max-w-7xl flex flex-col gap-4">
      {/* Full-width header */}
      <TokenHeader token={token} />

      {/* Full-width stats band */}
      <div className="border-y border-border bg-secondary/30 py-4 px-1 -mx-1">
        <MarketStats marketInfo={token.market_info} />
      </div>

      {/* Main + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main area */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Chart row: chart + bonding curve */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <ChartIntervalSelector value={interval} onChange={setInterval_} />
              <TradingChart data={chartData?.bars ?? []} />
            </div>
            {showBondingCurve && (
              <div className="w-full lg:w-[260px] shrink-0">
                <BondingCurveCard bondingPercent={token.market_info.bonding_percent} />
              </div>
            )}
          </div>

          {/* Bottom 3-column grid: Trades | Holders | About */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <span className="text-sm font-semibold">Trades</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                <TradesTable swaps={swapData?.data ?? []} isLoading={swapsLoading} />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <span className="text-sm font-semibold">Holders</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                <HoldersTable holders={holdersData?.data ?? []} isLoading={holdersLoading} />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <span className="text-sm font-semibold">About</span>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {token.token_info.description ? (
                  <p className="text-sm whitespace-pre-wrap">{token.token_info.description}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No description</p>
                )}
                {(token.token_info.website || token.token_info.twitter || token.token_info.telegram) && (
                  <div className="flex flex-wrap gap-3">
                    {token.token_info.website && (
                      <a
                        href={token.token_info.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-sky-400 hover:underline"
                      >
                        Website
                      </a>
                    )}
                    {token.token_info.twitter && (
                      <a
                        href={token.token_info.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-sky-400 hover:underline"
                      >
                        Twitter
                      </a>
                    )}
                    {token.token_info.telegram && (
                      <a
                        href={token.token_info.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-sky-400 hover:underline"
                      >
                        Telegram
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
          <TradePanel token={token} />
          <MilestoneStatusCard
            completed={token.market_info.milestone_completed}
            total={token.market_info.milestone_total}
          />
          <TokenInfoCard token={token} />
        </div>
      </div>
    </div>
  )
}
