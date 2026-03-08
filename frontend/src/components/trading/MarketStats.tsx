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
  const mcap = (Number(marketInfo.total_supply) / 1e18) * Number(marketInfo.token_price)
  const volume = Number(marketInfo.volume) / 1e18

  const stats = [
    { label: 'Price', value: `$${formatNumber(Number(marketInfo.token_price), 6)}` },
    { label: 'MCap', value: formatCompactUSD(mcap) },
    { label: 'ATH', value: `$${formatNumber(Number(marketInfo.ath_price), 6)}` },
    { label: '24h Vol', value: formatCompactUSD(volume) },
    { label: 'Holders', value: formatNumber(marketInfo.holder_count, 0) },
  ]

  return (
    <div className="flex flex-wrap gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{stat.label}</span>
          <span className="text-sm font-medium">{stat.value}</span>
        </div>
      ))}
    </div>
  )
}
