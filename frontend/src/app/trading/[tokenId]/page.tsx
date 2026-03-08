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
import { MilestoneStatusCard } from '@/components/trading/MilestoneStatusCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface TokenDetailPageProps {
  params: Promise<{ tokenId: string }>
}

const TABS = ['trades', 'holders', 'about'] as const
type Tab = (typeof TABS)[number]

export default function TokenDetailPage({ params }: TokenDetailPageProps) {
  const { tokenId: rawTokenId } = use(params)
  const tokenId = getAddress(rawTokenId)
  useTradingSubscription(tokenId)
  const [interval, setInterval_] = useState<ChartResolution>('1m')
  const [activeTab, setActiveTab] = useState<Tab>('trades')

  const { data: token, isLoading: tokenLoading, isError: tokenError } = useTokenDetail(tokenId)
  const { data: chartData } = useChartData(tokenId, interval)
  const { data: swapData, isLoading: swapsLoading } = useSwapHistory(tokenId)
  const { data: holdersData, isLoading: holdersLoading } = useTokenHolders(tokenId)

  if (tokenLoading) {
    return (
      <div className="px-4 py-6 mx-auto max-w-7xl flex flex-col gap-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-[400px] w-full" />
        <div className="flex gap-6">
          <Skeleton className="h-[300px] flex-1" />
          <Skeleton className="h-[300px] w-80" />
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

  return (
    <div className="px-4 py-6 mx-auto max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <TokenHeader token={token} />
          <MarketStats marketInfo={token.market_info} />

          <div className="flex flex-col gap-2">
            <ChartIntervalSelector value={interval} onChange={setInterval_} />
            <TradingChart data={chartData?.bars ?? []} />
          </div>

          <div className="flex flex-col">
            <div className="flex border-b border-border" role="tablist">
              {TABS.map((tab) => (
                <Button
                  key={tab}
                  variant="ghost"
                  size="sm"
                  role="tab"
                  id={`tab-${tab}`}
                  aria-selected={activeTab === tab}
                  aria-controls={`tabpanel-${tab}`}
                  className={`rounded-none capitalize ${
                    activeTab === tab
                      ? 'border-b-2 border-primary text-foreground'
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>

            <div role="tabpanel" id={`tabpanel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
              {activeTab === 'trades' && (
                <TradesTable swaps={swapData?.data ?? []} isLoading={swapsLoading} />
              )}
              {activeTab === 'holders' && (
                <HoldersTable holders={holdersData?.data ?? []} isLoading={holdersLoading} />
              )}
              {activeTab === 'about' && (
                <div className="flex flex-col gap-4 p-4">
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
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 flex flex-col gap-4">
          <TradePanel token={token} />
          <MilestoneStatusCard
            completed={token.market_info.milestone_completed}
            total={token.market_info.milestone_total}
          />
        </div>
      </div>
    </div>
  )
}
