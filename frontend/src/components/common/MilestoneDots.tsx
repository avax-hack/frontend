import { cn } from '@/lib/utils'

interface MilestoneDotsProps {
  completed: number
  total: number
  size?: 'sm' | 'md'
}

const dotSizes: Record<NonNullable<MilestoneDotsProps['size']>, string> = {
  sm: 'size-1.5',
  md: 'size-2',
}

export function MilestoneDots({ completed, total, size = 'sm' }: MilestoneDotsProps) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${completed} of ${total} milestones completed`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            'rounded-full',
            dotSizes[size],
            i < completed ? 'bg-emerald-500' : 'bg-neutral-700',
          )}
        />
      ))}
    </div>
  )
}
