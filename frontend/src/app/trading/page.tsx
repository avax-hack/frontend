'use client'

import { useState, useCallback } from 'react'
import { useTokenList } from '@/features/trading/hooks'
import { useNewContentSubscription } from '@/hooks/useWebSocket'
import type { SortType, TokenCategory } from '@/features/trading/types'
import { TokenCard, SortFilter, CategoryFilter, SearchBar } from '@/components/trading'
import { SkeletonCard } from '@/components/common/SkeletonCard'
import { EmptyState } from '@/components/common/EmptyState'

const SKELETON_COUNT = 6

export default function TradingPage() {
  useNewContentSubscription()
  const [sortType, setSortType] = useState<SortType>('creation_time_desc')
  const [category, setCategory] = useState<TokenCategory>('all')
  const [search, setSearch] = useState('')

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
  }, [])

  const { data, isLoading, isError } = useTokenList(sortType, {
    category: category !== 'all' ? category : undefined,
    search: search || undefined,
    is_ido: false,
  })

  return (
    <main className="dark-form relative -mt-[var(--header-h)] min-h-screen pt-[var(--header-h)] [--header-h:65px]">
      <div className="absolute inset-0 -z-10">
        <img src="/trading-bg.webp" alt="" className="size-full object-cover" />
        <div className="absolute inset-0 bg-[#070b14]/80 backdrop-blur-[2px]" />
      </div>
    <div className="flex flex-col gap-6 px-4 py-6 mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold">Trading</h1>

      <SearchBar value={search} onChange={handleSearchChange} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CategoryFilter value={category} onChange={setCategory} />
        <SortFilter value={sortType} onChange={setSortType} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : isError ? (
        <EmptyState message="Something went wrong" description="Failed to load tokens. Please try again." />
      ) : data?.data.length === 0 ? (
        <EmptyState message="No tokens found" />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.data.map((token) => (
            <TokenCard key={token.token_info.token_id} token={token} />
          ))}
        </div>
      )}
    </div>
    </main>
  )
}
