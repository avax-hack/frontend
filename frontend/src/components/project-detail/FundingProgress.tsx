import { ProgressBar } from '@/components/common/ProgressBar'
import { formatTokenToUSD } from '@/lib/utils'
import type { IProjectData } from '@/types/project'

interface FundingProgressProps {
  project: IProjectData
}

export function FundingProgress({ project }: FundingProgressProps) {
  const { market_info } = project
  const percent = market_info.funded_percent

  return (
    <div className="flex flex-col gap-2">
      <ProgressBar percent={percent} color="red" size="lg" />
      <p className="text-sm leading-[1.2] text-white/60">
        {Math.round(percent)}% — {formatTokenToUSD(market_info.total_committed)} raised
      </p>
    </div>
  )
}
