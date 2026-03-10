'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  ArrowLeftIcon,
  CopyIcon,
  CheckIcon,
  GlobeIcon,
  ExternalLinkIcon,
} from 'lucide-react'
import { truncateAddress } from '@/lib/utils'
import { SNOWTRACE_URL } from '@/lib/constants'
import type { ITokenData } from '@/features/trading/types'

interface TokenHeaderProps {
  token: ITokenData
}

export function TokenHeader({ token }: TokenHeaderProps) {
  const [copied, setCopied] = useState(false)
  const { token_info } = token

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  function handleCopy() {
    navigator.clipboard.writeText(token_info.token_id)
    setCopied(true)
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Button variant="ghost" size="icon-xs" asChild>
        <Link href="/trading" aria-label="Back to trading">
          <ArrowLeftIcon className="size-4" />
        </Link>
      </Button>

      {token_info.image_uri ? (
        <img
          src={token_info.image_uri}
          alt={`${token_info.name} logo`}
          className="size-8 rounded-full object-cover"
        />
      ) : (
        <div className="size-8 rounded-full bg-secondary" aria-hidden="true" />
      )}

      <span className="text-lg font-bold text-white">{token_info.name}</span>
      <span className="text-sm text-white/50">${token_info.symbol}</span>

      <span className="text-xs text-white/40">
        {truncateAddress(token_info.token_id)}
      </span>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Copy contract address"
        onClick={handleCopy}
      >
        {copied ? (
          <CheckIcon className="size-3" />
        ) : (
          <CopyIcon className="size-3" />
        )}
      </Button>

      {token_info.is_graduated ? (
        <StatusBadge label="V4" variant="green" size="sm" />
      ) : (
        <StatusBadge label="Bonding" variant="amber" size="sm" />
      )}
      <StatusBadge label="Avalanche" variant="red" size="sm" />

      <div className="flex items-center gap-1 ml-auto">
        <Button variant="ghost" size="icon-xs" asChild>
          <a
            href={`${SNOWTRACE_URL}/address/${token_info.token_id}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on Snowtrace"
          >
            <ExternalLinkIcon className="size-3.5" />
          </a>
        </Button>
        {token_info.website && (
          <Button variant="ghost" size="icon-xs" asChild>
            <a href={token_info.website} target="_blank" rel="noopener noreferrer" aria-label="Website">
              <GlobeIcon className="size-3.5" />
            </a>
          </Button>
        )}
        {token_info.twitter && (
          <Button variant="ghost" size="icon-xs" asChild>
            <a href={token_info.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </Button>
        )}
        {token_info.telegram && (
          <Button variant="ghost" size="icon-xs" asChild>
            <a href={token_info.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}
