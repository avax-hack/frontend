'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon?: React.ReactNode
  message: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function EmptyState({
  icon,
  message,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      {icon && (
        <div className="text-white/30 [&>svg]:size-12" aria-hidden="true">
          {icon}
        </div>
      )}
      <p className="text-lg font-medium text-white">{message}</p>
      {description && (
        <p className="text-sm text-white/50">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Button
          asChild
          variant="outline"
          className="border-white/10 text-white hover:bg-white/5"
        >
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
      {actionLabel && !actionHref && onAction && (
        <Button
          variant="outline"
          onClick={onAction}
          className="border-white/10 text-white hover:bg-white/5"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
