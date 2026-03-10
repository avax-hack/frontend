'use client'

import { formatNumber } from '@/lib/utils'
import type { IMarketInfo } from '@/features/trading/types'

interface MarketStatsProps {
  marketInfo: IMarketInfo
}

function formatCompactUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: value >= 1_000 ? 'compact' : 'standard',
    maximumFractionDigits: value >= 1_000 ? 1 : 2,
  }).format(value)
}

export function MarketStats({ marketInfo }: MarketStatsProps) {
  const mcap = Number(marketInfo.total_supply) * Number(marketInfo.token_price)
  const volume = Number(marketInfo.volume)

  const stats = [
    { label: 'Price', value: `$${formatNumber(Number(marketInfo.token_price), 6)}` },
    { label: 'MCap', value: formatCompactUSD(mcap) },
    { label: 'ATH', value: `$${formatNumber(Number(marketInfo.ath_price), 6)}` },
    { label: '24h Vol', value: formatCompactUSD(volume) },
    { label: 'Holders', value: formatNumber(marketInfo.holder_count, 0) },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-border bg-card px-4 py-3 flex flex-col gap-1"
        >
          <span className="text-xs text-white/60">{stat.label}</span>
          <span className="text-sm font-semibold text-white">{stat.value}</span>
        </div>
      ))}
    </div>
  )
}
