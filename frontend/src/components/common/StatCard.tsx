import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  change?: number
  prefix?: string
  size?: 'sm' | 'md' | 'lg'
}

export function StatCard({ label, value, change, prefix, size = 'md' }: StatCardProps) {
  const valueSizes = { sm: 'text-xl', md: 'text-2xl', lg: 'text-3xl' }
  const paddings = { sm: 'p-3', md: 'p-4', lg: 'p-6' }

  return (
    <Card className={cn('flex flex-col gap-1', paddings[size])}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className={cn('font-bold', valueSizes[size])}>
          {prefix}{value}
        </span>
        {change !== undefined && (
          <span className={cn(
            'text-sm font-medium',
            change >= 0 ? 'text-emerald-400' : 'text-red-400',
          )}>
            {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
    </Card>
  )
}
