import { cn } from '@/lib/utils'

interface ProgressBarProps {
  percent: number
  color?: 'green' | 'purple' | 'blue'
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const colorClasses: Record<NonNullable<ProgressBarProps['color']>, string> = {
  green: 'bg-emerald-500',
  purple: 'bg-purple-500',
  blue: 'bg-sky-500',
}

const sizeClasses: Record<NonNullable<ProgressBarProps['size']>, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

export function ProgressBar({
  percent,
  color = 'blue',
  showLabel,
  size = 'md',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent))

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn('rounded-full bg-secondary overflow-hidden', sizeClasses[size])}
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorClasses[color])}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted-foreground">
          {Math.round(clamped)}%
        </p>
      )}
    </div>
  )
}
