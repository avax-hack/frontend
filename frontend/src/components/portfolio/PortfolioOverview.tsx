'use client'

import { StatCard } from '@/components/common/StatCard'
import { Skeleton } from '@/components/ui/skeleton'
import { formatWeiToUSD } from '@/lib/utils'
import type { IPortfolioSummaryData } from '@/features/portfolio/types'

interface PortfolioOverviewProps {
  data: IPortfolioSummaryData | undefined
  isLoading: boolean
}

export function PortfolioOverview({ data, isLoading }: PortfolioOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Portfolio Value"
        value={data ? formatWeiToUSD(data.portfolio_value) : '$0'}
      />
      <StatCard
        label="Total Invested (IDO)"
        value={data ? formatWeiToUSD(data.total_invested_ido) : '$0'}
      />
      <StatCard
        label="Trading P&L"
        value={data ? formatWeiToUSD(data.trading_pnl) : '$0'}
        change={data?.trading_pnl_percent}
      />
      <StatCard
        label="Active IDOs"
        value={data?.active_idos ?? 0}
      />
    </div>
  )
}
