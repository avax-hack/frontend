'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/common/StatusBadge'
import { MilestoneDots } from '@/components/common/MilestoneDots'
import { EmptyState } from '@/components/common/EmptyState'
import { formatTokenToUSD, formatNumber, formatLaunchDate, truncateAddress } from '@/lib/utils'
import { SNOWTRACE_URL } from '@/lib/constants'
import type { ActivityTab, IIdoParticipation, IAccountSwapRecord, IRefundRecord } from '@/features/portfolio/types'

interface ActivitySectionProps {
  idoHistory: IIdoParticipation[] | undefined
  swapHistory: IAccountSwapRecord[] | undefined
  refundHistory: IRefundRecord[] | undefined
  isLoading: boolean
}

const TABS: { value: ActivityTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'ido', label: 'IDO Participation' },
  { value: 'trades', label: 'Trades' },
  { value: 'refunds', label: 'Refunds' },
]

export function ActivitySection({
  idoHistory,
  swapHistory,
  refundHistory,
  isLoading,
}: ActivitySectionProps) {
  const [activeTab, setActiveTab] = useState<ActivityTab>('all')

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    )
  }

  const showIdo = activeTab === 'all' || activeTab === 'ido'
  const showTrades = activeTab === 'all' || activeTab === 'trades'
  const showRefunds = activeTab === 'all' || activeTab === 'refunds'

  const hasAny =
    (showIdo && idoHistory && idoHistory.length > 0) ||
    (showTrades && swapHistory && swapHistory.length > 0) ||
    (showRefunds && refundHistory && refundHistory.length > 0)

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-white">Activity</h2>

      <div className="flex border-b border-border" role="tablist">
        {TABS.map((tab) => (
          <Button
            key={tab.value}
            variant="ghost"
            size="sm"
            role="tab"
            id={`activity-tab-${tab.value}`}
            aria-selected={activeTab === tab.value}
            aria-controls={`activity-panel-${tab.value}`}
            className={`rounded-none ${
              activeTab === tab.value
                ? 'border-b-2 border-primary text-white'
                : 'text-white/50'
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`activity-panel-${activeTab}`}
        aria-labelledby={`activity-tab-${activeTab}`}
      >
        {!hasAny && (
          <EmptyState
            message="No activity yet"
            description="Your investment and trading activity will appear here"
            actionLabel="Start Trading"
            actionHref="/trading"
          />
        )}

        <div className="flex flex-col gap-3">
          {showIdo && idoHistory && idoHistory.length > 0 && (
            <div className="flex flex-col gap-2">
              {activeTab === 'all' && (
                <h3 className="text-sm font-medium text-white/60">IDO Participation</h3>
              )}
              {idoHistory.map((item, index) => (
                <Card key={`ido-${item.project_info.project_id}-${index}`} className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {item.project_info.image_uri ? (
                        <img
                          src={item.project_info.image_uri}
                          alt=""
                          className="size-8 rounded-full"
                        />
                      ) : (
                        <div className="size-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                          {item.project_info.symbol.charAt(0)}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-white truncate">{item.project_info.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/50">
                            Invested: {formatTokenToUSD(item.invested_amount)}
                          </span>
                          <MilestoneDots
                            completed={item.milestone_progress.completed}
                            total={item.milestone_progress.total}
                          />
                        </div>
                      </div>
                    </div>
                    <StatusBadge
                      label={item.status}
                      variant={
                        item.status === 'active'
                          ? 'green'
                          : item.status === 'completed'
                            ? 'blue'
                            : 'red'
                      }
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {showTrades && swapHistory && swapHistory.length > 0 && (
            <div className="flex flex-col gap-2">
              {activeTab === 'all' && (
                <h3 className="text-sm font-medium text-white/60">Trades</h3>
              )}
              <Card className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white/70">Time</TableHead>
                      <TableHead className="text-white/70">Token</TableHead>
                      <TableHead className="text-white/70">Type</TableHead>
                      <TableHead className="text-right text-white/70">Amount</TableHead>
                      <TableHead className="text-right text-white/70">TX</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {swapHistory.map((swap, index) => (
                      <TableRow key={`swap-${swap.transaction_hash}-${index}`}>
                        <TableCell className="text-white/60">
                          {formatLaunchDate(swap.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {swap.token_info.image_uri ? (
                              <img
                                src={swap.token_info.image_uri}
                                alt=""
                                className="size-5 rounded-full"
                              />
                            ) : (
                              <div className="size-5 rounded-full bg-secondary" />
                            )}
                            <span className="text-white">{swap.token_info.symbol}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            label={swap.event_type}
                            variant={swap.event_type === 'BUY' ? 'green' : 'red'}
                            size="sm"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          ${formatNumber(Number(swap.native_amount), 2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <a
                            href={`${SNOWTRACE_URL}/tx/${swap.transaction_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {truncateAddress(swap.transaction_hash, 4)}
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {showRefunds && refundHistory && refundHistory.length > 0 && (
            <div className="flex flex-col gap-2">
              {activeTab === 'all' && (
                <h3 className="text-sm font-medium text-white/60">Refunds</h3>
              )}
              {refundHistory.map((refund, index) => (
                <Card key={`refund-${refund.transaction_hash}-${index}`} className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-white truncate">
                        {refund.project_info.name}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <span>Invested: {formatTokenToUSD(refund.original_investment)}</span>
                        <span>→</span>
                        <span>Refund: {formatTokenToUSD(refund.refund_amount)}</span>
                      </div>
                      <span className="text-xs text-red-400">
                        Failed: {refund.failed_milestone}
                      </span>
                    </div>
                    <a
                      href={`${SNOWTRACE_URL}/tx/${refund.transaction_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline shrink-0"
                    >
                      View TX
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
