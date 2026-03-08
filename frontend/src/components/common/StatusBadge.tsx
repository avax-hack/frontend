import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  label: string
  variant: 'green' | 'amber' | 'red' | 'gray' | 'purple' | 'blue'
  size?: 'sm' | 'md'
}

const variantClasses: Record<StatusBadgeProps['variant'], string> = {
  green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/25',
  amber: 'bg-amber-500/20 text-amber-400 border-amber-500/25',
  red: 'bg-red-500/20 text-red-400 border-red-500/25',
  gray: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/25',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/25',
  blue: 'bg-sky-500/20 text-sky-400 border-sky-500/25',
}

const sizeClasses: Record<NonNullable<StatusBadgeProps['size']>, string> = {
  sm: 'text-[10px] px-1.5 py-0',
  md: 'text-xs px-2 py-0.5',
}

export function StatusBadge({ label, variant, size = 'md' }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(variantClasses[variant], sizeClasses[size])}
    >
      {label}
    </Badge>
  )
}
