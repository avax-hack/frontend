import { StatCard } from '@/components/common/StatCard'
import { formatWeiToUSD, formatNumber } from '@/lib/utils'
import type { IProjectData } from '@/types/project'

interface FundingStatsProps {
  project: IProjectData
}

export function FundingStats({ project }: FundingStatsProps) {
  const { market_info } = project

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        label="Target Raise"
        value={formatWeiToUSD(market_info.target_raise)}
      />
      <StatCard
        label="Total Committed"
        value={formatWeiToUSD(market_info.total_committed)}
      />
      <StatCard
        label="Investors"
        value={formatNumber(market_info.investor_count, 0)}
      />
    </div>
  )
}
