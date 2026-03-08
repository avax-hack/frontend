import { ProgressBar } from '@/components/common/ProgressBar'
import { formatWeiToUSD } from '@/lib/utils'
import type { IProjectData } from '@/types/project'

function getProgressColor(percent: number): 'green' | 'purple' | 'blue' {
  if (percent >= 75) return 'green'
  if (percent >= 40) return 'blue'
  return 'purple'
}

interface FundingProgressProps {
  project: IProjectData
}

export function FundingProgress({ project }: FundingProgressProps) {
  const { market_info } = project
  const percent = market_info.funded_percent

  return (
    <div className="flex flex-col gap-2">
      <ProgressBar percent={percent} color={getProgressColor(percent)} size="lg" />
      <p className="text-sm leading-[1.2] text-muted-foreground">
        {Math.round(percent)}% — {formatWeiToUSD(market_info.total_committed)} raised
      </p>
    </div>
  )
}
