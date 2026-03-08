import { cn } from '@/lib/utils'

interface ProgressBarProps {
  percent: number
  color?: 'green' | 'purple' | 'blue' | 'cyan'
  showLabel?: boolean
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

const colorClasses = {
  green: 'bg-emerald-500',
  purple: 'bg-purple-500',
  blue: 'bg-sky-500',
  cyan: 'bg-cyan-500',
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

export function ProgressBar({
  percent,
  color = 'cyan',
  showLabel,
  label,
  size = 'md',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent))

  return (
    <div className="flex flex-col gap-1">
      <div className={cn('rounded-full bg-secondary overflow-hidden', sizeClasses[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorClasses[color])}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {(showLabel || label) && (
        <p className="text-xs text-muted-foreground">
          {label ?? `${Math.round(clamped)}%`}
        </p>
      )}
    </div>
  )
}
