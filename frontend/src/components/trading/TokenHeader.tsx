'use client'

import { useState, useEffect } from 'react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { CopyIcon, CheckIcon, GlobeIcon, ExternalLinkIcon } from 'lucide-react'
import { truncateAddress } from '@/lib/utils'
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
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {token_info.image_uri ? (
          <img
            src={token_info.image_uri}
            alt={`${token_info.name} logo`}
            className="size-12 rounded-full object-cover"
          />
        ) : (
          <div className="size-12 rounded-full bg-secondary" aria-hidden="true" />
        )}
        <div className="flex flex-col gap-1">
          <span className="text-xl font-bold">{token_info.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{token_info.symbol}</span>
            <span className="text-xs text-muted-foreground">
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
              <StatusBadge label="V4" variant="green" />
            ) : (
              <StatusBadge label="Bonding" variant="amber" />
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {token_info.website && (
          <Button
            variant="ghost"
            size="sm"
            aria-label="Website"
            asChild
          >
            <a href={token_info.website} target="_blank" rel="noopener noreferrer">
              <GlobeIcon className="size-4" />
            </a>
          </Button>
        )}
        {token_info.twitter && (
          <Button
            variant="ghost"
            size="sm"
            aria-label="Twitter"
            asChild
          >
            <a href={token_info.twitter} target="_blank" rel="noopener noreferrer">
              <ExternalLinkIcon className="size-4" />
            </a>
          </Button>
        )}
        {token_info.telegram && (
          <Button
            variant="ghost"
            size="sm"
            aria-label="Telegram"
            asChild
          >
            <a href={token_info.telegram} target="_blank" rel="noopener noreferrer">
              <ExternalLinkIcon className="size-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}
