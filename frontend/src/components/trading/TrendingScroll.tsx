'use client'

import Link from 'next/link'
import { FlameIcon } from 'lucide-react'
import { useTrendingTokens } from '@/features/trading/hooks'
import { safeGetAddress } from '@/lib/utils'

function formatCompactUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: value >= 1_000 ? 'compact' : 'standard',
    maximumFractionDigits: value >= 1_000 ? 1 : 2,
  }).format(value)
}

export function TrendingScroll() {
  const { data, isLoading } = useTrendingTokens()

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-1">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-12 w-48 shrink-0 animate-pulse rounded-lg bg-secondary/50" />
        ))}
      </div>
    )
  }

  if (!data?.tokens.length) return null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
        <FlameIcon className="size-4 text-orange-400" />
        <span>Trending</span>
      </div>
      <div className="flex snap-x gap-3 overflow-x-auto pb-1 scrollbar-none">
        {data.tokens.map((token) => {
          const { token_info, market_info } = token
          const checkedId = safeGetAddress(token_info.token_id)
          const mcap = Number(market_info.total_supply) * Number(market_info.token_price)

          if (!checkedId) return null

          return (
            <Link
              key={token_info.token_id}
              href={`/trading/${checkedId}`}
              className="flex shrink-0 snap-start items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 px-4 py-2 transition hover:bg-secondary/60"
            >
              {token_info.image_uri ? (
                <img
                  src={token_info.image_uri}
                  alt={`${token_info.name} logo`}
                  className="size-8 rounded-full object-cover"
                />
              ) : (
                <div className="size-8 rounded-full bg-secondary" aria-hidden="true" />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium">{token_info.name}</span>
                <span className="text-xs text-muted-foreground">
                  MCap {formatCompactUSD(mcap)}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
