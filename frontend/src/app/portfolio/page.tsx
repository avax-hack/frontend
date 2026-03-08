'use client'

import { WalletRequired } from '@/components/portfolio/WalletRequired'
import { PortfolioOverview } from '@/components/portfolio/PortfolioOverview'
import { HoldingsTable } from '@/components/portfolio/HoldingsTable'
import { ActivitySection } from '@/components/portfolio/ActivitySection'
import { useAuthStore } from '@/stores/authStore'
import {
  usePortfolioSummary,
  useHoldTokens,
  useIdoHistory,
  useSwapHistory,
  useRefundHistory,
} from '@/features/portfolio/hooks'

export default function PortfolioPage() {
  return (
    <WalletRequired>
      <PortfolioContent />
    </WalletRequired>
  )
}

function PortfolioContent() {
  const account = useAuthStore((s) => s.account)
  const accountId = account?.account_id

  const { data: summary, isLoading: summaryLoading } = usePortfolioSummary(accountId)
  const { data: holdTokens, isLoading: holdingsLoading } = useHoldTokens(accountId)
  const { data: idoData, isLoading: idoLoading } = useIdoHistory(accountId)
  const { data: swapData, isLoading: swapLoading } = useSwapHistory(accountId)
  const { data: refundData, isLoading: refundLoading } = useRefundHistory(accountId)

  const activityLoading = idoLoading || swapLoading || refundLoading

  return (
    <div className="px-4 py-6 mx-auto max-w-7xl flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Portfolio</h1>

      <PortfolioOverview data={summary} isLoading={summaryLoading} />

      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">My Holdings</h2>
        <HoldingsTable
          tokens={holdTokens?.data}
          isLoading={holdingsLoading}
        />
      </div>

      <ActivitySection
        idoHistory={idoData?.data}
        swapHistory={swapData?.data}
        refundHistory={refundData?.data}
        isLoading={activityLoading}
      />
    </div>
  )
}
