import { cn } from '@/lib/utils'

interface ProgressBarProps {
  percent: number
  color?: 'green' | 'purple' | 'blue' | 'red'
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const colorClasses: Record<NonNullable<ProgressBarProps['color']>, string> = {
  green: 'bg-emerald-500',
  purple: 'bg-purple-500',
  blue: 'bg-sky-500',
  red: 'bg-gradient-to-r from-red-500 via-rose-400 to-rose-300',
}

const glowClasses: Record<NonNullable<ProgressBarProps['color']>, string> = {
  green: 'shadow-[0_0_8px_rgba(16,185,129,0.4)]',
  purple: 'shadow-[0_0_8px_rgba(168,85,247,0.4)]',
  blue: 'shadow-[0_0_8px_rgba(14,165,233,0.4)]',
  red: 'shadow-[0_0_8px_rgba(244,63,94,0.4)]',
}

const sizeClasses: Record<NonNullable<ProgressBarProps['size']>, string> = {
  sm: 'h-1.5',
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
        className={cn('rounded-full bg-white/[0.06] overflow-hidden', sizeClasses[size])}
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            colorClasses[color],
            clamped > 0 && glowClasses[color],
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-white/40">
          {Math.round(clamped)}%
        </p>
      )}
    </div>
  )
}
