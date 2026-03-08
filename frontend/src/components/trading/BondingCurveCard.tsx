'use client'

import { Card } from '@/components/ui/card'
import { ProgressBar } from '@/components/common/ProgressBar'

interface BondingCurveCardProps {
  bondingPercent: number
}

export function BondingCurveCard({ bondingPercent }: BondingCurveCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-3">
      <span className="text-sm font-medium">Bonding Curve Progress</span>
      <ProgressBar percent={bondingPercent} color="purple" size="md" showLabel />
      <span className="text-xs text-muted-foreground">Graduates at 100%</span>
    </Card>
  )
}
